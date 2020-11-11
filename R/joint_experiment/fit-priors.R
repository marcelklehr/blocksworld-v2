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
BetaFits = function(save_as, target_dir_params= "../MA-project/conditionals/data") {
  get_optimal_params = function(cn, id=NA){
    # print(cn)
    if(cn == "A || C"){
      df.observations = TABLES.ind %>% cnToProbs(cn);
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
      
      params = tibble(p_a1 = fit_opt.p_a$par$p_a.shape[1],
                      p_a2 = fit_opt.p_a$par$p_a.shape[2],
                      p_c1 = fit_opt.p_c$par$p_c.shape[1],
                      p_c2 = fit_opt.p_c$par$p_c.shape[2],
                      cn=cn, id=id);
    } else {
      df.observations = TABLES.dep %>% cnToProbs(cn);
      if(!is.na(id)) df.observations = df.observations %>% filter(id==(!! id));
      y = list(conditional_pos = df.observations %>% pull(p_pos),
               conditional_neg = df.observations %>% pull(p_neg),
               conditional_marginal = df.observations %>% pull(p_marginal)
      );
      # priors of the parameters of the beta distributions
      pos.shape = uniform(0, 10, 2)
      neg.shape = uniform(0, 10, 2)
      marg.shape = uniform(0, 10, 2)
      distribution(y$conditional_pos) <- beta(pos.shape[1], pos.shape[2])
      distribution(y$conditional_neg) <- beta(neg.shape[1], neg.shape[2])
      distribution(y$conditional_marginal) <- beta(marg.shape[1], marg.shape[2])
      
      # fits
      m.pos <- model(pos.shape)
      m.neg <- model(neg.shape)
      m.marg <- model(marg.shape)
      fit_opt.pos <- opt(m.pos)
      fit_opt.neg <- opt(m.neg)
      fit_opt.marg <- opt(m.marg)
      
      params = tibble(pos1=fit_opt.pos$par$pos.shape[1],
                      pos2=fit_opt.pos$par$pos.shape[2],
                      neg1 = fit_opt.neg$par$neg.shape[1],
                      neg2 = fit_opt.neg$par$neg.shape[2],
                      marg1 = fit_opt.marg$par$marg.shape[1],
                      marg2 = fit_opt.marg$par$marg.shape[2],
                      cn=cn, id=id);
    }
    return(params)
  }
  results = pmap_dfr(ID_CNS, function(id, cn){
                       print(paste(id, cn))
                       get_optimal_params(cn, id)
                     });
  write_csv(results, paste(RESULT.dir, save_as, sep=SEP))
  
  results.formatted = formatParams4WebPPL(results);
  save_to = paste(target_dir_params, "params-formatted.rds", sep=SEP)
  write_rds(results.formatted, save_to)
  print(paste('saved formatted ll-params for input to webppl:', save_to))
  return(results)
}

res.fits = BetaFits("beta-fits.csv")
