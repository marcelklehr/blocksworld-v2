# library(dplyr)
# library(ggplot2)
# library(tidyverse)
# library(here)
# library(reticulate)
# library(scales)
# library(truncnorm)
# use_condaenv("anaconda3/py36")
# library(greta)
# source("R/utils.R")
# source("R/utils-exp1.R")
source("R/joint_experiment/my-utils.R")

fn = paste(RESULT.dir, "experiment-wor(l)ds-of-toy-blocks_tables_all.csv",
           sep=.Platform$file.sep)
# fn = paste(RESULT.dir, "experiment-wor(l)ds-of-toy-blocks_tables_filtered.csv", sep=.Platform$file.sep)

# Setup -------------------------------------------------------------------
# todo move somewhere else
# tables.orig <- read_csv(fn) %>% rename(AC=bg, `A-C`=b, `-AC`=g, `-A-C`=none)
# tables.mat = tables.orig %>% select(AC, `A-C`, `-AC`, `-A-C`) %>% as.matrix()
# tables.smooth = prop.table(tables.mat + epsilon, 1)
# tables.smooth = cbind(tables.smooth, rowid=seq.int(from=1, to=nrow(tables.mat), by=1)) %>%
#   as_tibble() %>% 
#   mutate(p_c_given_a=`AC`/(`AC`+`A-C`),
#          p_c_given_na=`-AC`/(`-AC`+`-A-C`),
#          p_a_given_c=`AC`/(`AC`+`-AC`),
#          p_a_given_nc=`A-C`/(`A-C`+`-A-C`),
#          p_a=`AC`+`A-C`, p_c=AC+`-AC`,
#          theta_ac = (p_c_given_a - p_c_given_na) / (1 - p_c_given_na),
#          theta_anc = ((1-p_c_given_a) - (1-p_c_given_na)) / (1 - (1-p_c_given_na)),
#          theta_ca = (p_a_given_c - p_a_given_nc) / (1 - p_a_given_nc),
#          theta_cna = ((1-p_a_given_c) - (1-p_a_given_nc)) / (1 - (1-p_a_given_nc)),
#   );
# 
# 
# TABLES = left_join(
#   tables.smooth,
#   tables.orig %>% select(id, prolific_id) %>% rowid_to_column(var="rowid"),
#   by="rowid") %>% select(-rowid)
# 
# TABLES.long = TABLES %>% rowid_to_column() %>%
#   mutate(ind_diff=AC-(p_a*p_c)) %>% 
#   pivot_longer(cols=c(-prolific_id, -id), names_to="cell", values_to="val")
# TABLES.mat = TABLES %>% as.matrix()
# TABLES.ind = TABLES %>% filter(str_detect(id, "independent"))
# TABLES.dep = TABLES %>% filter(!str_detect(id, "independent"))
# save other place

# Functions ---------------------------------------------------------------
cnToProbs = function(y.tables, cn){
  if(cn=="A implies C"){
    df = y.tables %>%
      mutate(p_pos=p_c_given_a, p_neg=p_c_given_na, p_marginal=p_a,
             causal_power=theta_ac) %>% select(-starts_with("theta_"))
  } else if(cn=="A implies -C") {
    df = y.tables %>%
      mutate(p_pos=1-p_c_given_a, p_neg=1-p_c_given_na, p_marginal=p_a,
             causal_power=theta_anc) %>% select(-starts_with("theta_"))
  } else if(cn=="C implies A") {
    df = y.tables %>%
      mutate(p_pos=p_a_given_c, p_neg=p_a_given_nc, p_marginal=p_c,
             causal_power=theta_ca) %>% select(-starts_with("theta_"))
  } else if(cn=="C implies -A") {
    df = y.tables %>%
      mutate(p_pos=1-p_a_given_c, p_neg=1-p_a_given_nc, p_marginal=p_c,
             causal_power=theta_cna) %>% select(-starts_with("theta_"))
  } else if(cn == "A || C"){
    df = y.tables
  }
  return(df)
}

# Fit P(C|A), P(C|-A), P(A) beta distributions ----------------------------
BetaFits = function(save_as) {
  get_optimal_params = function(cn, id=NA){
    # print(cn)
    if(cn == "A || C"){
      df.observations = TABLES.ind %>% cnToProbs(cn)
      if(!is.na(id)) df.observations = df.observations %>% filter(id==(!! id));
      y = list(p_a=df.observations$p_a,
               p_c=df.observations$p_c)
      # PRIORS of the parameters of the distributions
      # p_a.shape = uniform(0, 10, 2)
      # p_c.shape = uniform(0, 10, 2)
      p_a.shape = uniform(0, 1, 2)
      p_c.shape = uniform(0, 1, 2)
      
      # LIKELIHOODS
      # distribution(y$p_a) <- beta(p_a.shape[1], p_a.shape[2])
      # distribution(y$p_c) <- beta(p_c.shape[1], p_c.shape[2])
      distribution(y$p_a) <- normal(p_a.shape[1], p_a.shape[2], truncation=c(0,1))
      distribution(y$p_c) <- normal(p_c.shape[1], p_c.shape[2], truncation=c(0,1))
      
      m.p_a <- model(p_a.shape)
      m.p_c <- model(p_c.shape)
      fit_opt.p_a <- opt(m.p_a)
      fit_opt.p_c <- opt(m.p_c)
      
      params = tibble(
        p_a.shape1 = fit_opt.p_a$par$p_a.shape[1],
        p_a.shape2 = fit_opt.p_a$par$p_a.shape[2],
        p_c.shape1 = fit_opt.p_c$par$p_c.shape[1],
        p_c.shape2 = fit_opt.p_c$par$p_c.shape[2],
        cn=cn, id=id
      )
    } else {
      df.observations = TABLES.dep %>% cnToProbs(cn)
      if(!is.na(id)) df.observations = df.observations %>% filter(id==(!! id));
      y = list(causal_power.pos = df.observations %>%
                 filter(causal_power > 0) %>% pull(causal_power),
               causal_power.neg = df.observations %>%
                 filter(causal_power <= 0) %>% pull(causal_power),
               conditional_pos = df.observations %>% pull(p_pos),
               conditional_neg = df.observations %>% pull(p_neg),
               conditional_marginal = df.observations %>% pull(p_marginal)
      );
      # priors of the parameters of the beta distributions
      cp_pos.shape = uniform(0, 10, 2)
      cp_neg.rate = uniform(0, 20, 1)
      pos.shape = uniform(0, 10, 2)
      neg.shape = uniform(0, 10, 2)
      marg.shape = uniform(0, 10, 2)
      
      distribution(y$causal_power.pos) <- beta(cp_pos.shape[1], cp_pos.shape[2])
      distribution(y$causal_power.neg) <- exponential(cp_neg.rate[1])
      distribution(y$conditional_pos) <- beta(pos.shape[1], pos.shape[2])
      distribution(y$conditional_neg) <- beta(neg.shape[1], neg.shape[2])
      distribution(y$conditional_marginal) <- beta(marg.shape[1], marg.shape[2])
      
      # fits
      m.cp_pos <- model(cp_pos.shape)
      m.cp_neg <- model(cp_neg.rate)
      fit_opt.cp_pos <- opt(m.cp_pos)
      fit_opt.cp_neg <- opt(m.cp_neg)
      
      m.pos <- model(pos.shape)
      m.neg <- model(neg.shape)
      m.marg <- model(marg.shape)
      fit_opt.pos <- opt(m.pos)
      fit_opt.neg <- opt(m.neg)
      fit_opt.marg <- opt(m.marg)
      
      params =     tibble(
        cp_pos.shape1 = fit_opt.cp_pos$par$cp_pos.shape[1],
        cp_pos.shape2 = fit_opt.cp_pos$par$cp_pos.shape[2],
        cp_neg.rate = fit_opt.cp_neg$par$cp_neg.rate[1],
        
        pos.shape1 = fit_opt.pos$par$pos.shape[1],
        pos.shape2 = fit_opt.pos$par$pos.shape[2],
        neg.shape1 = fit_opt.neg$par$neg.shape[1],
        neg.shape2 = fit_opt.neg$par$neg.shape[2],
        marg.shape1 = fit_opt.marg$par$marg.shape[1],
        marg.shape2 = fit_opt.marg$par$marg.shape[2],
        cn=cn, id=id
      );
    }
    return(params)
  }
  results = pmap_dfr(ID_CNS, function(id, cn){
                       get_optimal_params(cn, id)
                     });
  # fits = add_mirrored_cns(results);
  write_csv(results, paste(RESULT.dir, save_as, sep=.Platform$file.sep))
  return(results)
}
res.fits = BetaFits("beta-fits-by-stimulus.csv", by_stimulus=TRUE)
