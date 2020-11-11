plotSliderRatings <- function(data, questions, labels, cluster_by="g", relation=FALSE){
  dat <- data %>% ungroup() %>%
    mutate(question = factor(question, levels = (!!questions)),
           response=as.numeric(response))
  
  df <- cluster_responses(dat, cluster_by);
  if(relation) {
    df.stats = df %>% group_by(question, id, understood_rel) %>%
      select(question, id, response, understood_rel) %>%
      summarize(mu=mean(response), med=median(response), .groups="keep");
  } else {
    df.stats = df %>% group_by(question, id) %>%
      select(question, id, response) %>%
      summarize(mu=mean(response), med=median(response), .groups="keep");
  }
  ids <- df$id %>% unique() %>% as.character()
  # ids <- c("independent_hh")
  for (id in ids){
    p <- df  %>% filter(id == (!! id)) %>% 
      ggplot(aes(y=response, x=factor(0)))
    if(relation) {
      p <- p + geom_boxplot(aes(colour=understood_rel), outlier.shape=NA,
                            position=position_dodge(0.75))
      df.stats <- df.stats %>% group_by(question, id, understood_rel)
    } else {
      p <- p + geom_boxplot(outlier.shape=NA) +
        guides(color=FALSE)
    }
    p <- p + 
      geom_jitter(width=0.1, height = 0, alpha=0.5) + #, colour = prolific_id)) +
      geom_point(data=df.stats %>% filter(id==(!! id)),
                 mapping=aes(y=mu, x=factor(0)),  size=2, shape=23) +
      # geom_vline(aes(xintercept=med), color = "red", size=0.5) +
      geom_hline(aes(yintercept=0), color = "grey", size=0.2, linetype='dashed') +
      geom_hline(aes(yintercept=0.25), color = "grey", size=0.2, linetype='dashed') +
      geom_hline(aes(yintercept=0.5), color = "gray45", size=0.5, linetype='dashed') +
      geom_hline(aes(yintercept=0.75), color = "grey", size=0.2, linetype='dashed') +
      geom_hline(aes(yintercept=1), color = "grey", size=0.2, linetype='dashed') +
      scale_y_continuous(limits=c(-0.2, 1.2),
                         breaks=c(0, 0.25, 0.5, 0.75, 1)) +
      labs(x="estimates probability", y="", title=id) +
      theme_bw() +
      facet_wrap(~question, nrow=2, ncol=2, labeller = as_labeller(labels)) + 
      theme(axis.text.x=element_blank(),
            axis.ticks.x =element_blank(),
            text = element_text(size=14),
            legend.position = "right")
    print(p)
  }
  
}

#returns prolific_id + (stimulus) id of participants to be excluded 
filterOutLowQuality = function(df, fct_iqr=1.5){
  dat.all = df %>% group_by(question, id) %>%
    mutate(quantiles=list(quantile(mean_diff)),
           names=list(c("Q0", "Q1", "Q2", "Q3", "Q4"))) %>%
    unnest(c(quantiles, names)) %>%
    pivot_wider(names_from="names", values_from="quantiles") %>% 
    mutate(IQR=Q3-Q1)
  dat.bad = dat.all %>%
    filter(mean_diff <= (mu - 1.75*sd) | mean_diff >= (mu + 1.75*sd)) 
    # filter(mean_diff < Q1 - fct_iqr * IQR | mean_diff > Q3 + fct_iqr * IQR) %>%
  dat.remove = dat.bad %>% ungroup() %>% select(comparator, id) %>% distinct() %>%
    rename(prolific_id=comparator)
  
  n_filtered = nrow(dat.remove)
  # message(paste("#datapoints (tables) filtered as < Q1-", fct_iqr, "*IQR or > Q3+",
  #               fct_iqr, "*IQR: ", n_filtered,
  #               " (", round(n_filtered/(nrow(dat.all)/4), 2), ")", sep=""))
  message(paste("#datapoints (tables) filtered as more than two sd greater/smaller than mu",
                " (", n_filtered, " tables, ", round(n_filtered/(nrow(dat.all)/4),2), ")", sep=""))
  return(dat.bad)
}


filter_by_train_data = function(dat, theta_large=0.5, max_diff_equal=0.2, theta_small=0.15){
  df.filtered = dat %>%
    filter(!(id == "distance0" & r+ry > y+ry )) %>% #P(red)>P(yellow)
    filter(!(id == "distance1" & r+ry < y+ry)) %>% #P(red)<P(yellow)
    filter(!(id == "ssw0" & y < theta_small)) %>% # yellow, ¬red
    filter(!(id == "ssw1" & r < theta_small)) %>% # red, ¬yellow
    filter(!(id == "uncertain1" & (ry + y < theta_small))) %>%
    filter(!(id == "uncertain2" & (none + y) > threshold)) %>%
    filter(!(id == "uncertain3" & ((ry + r > threshold) | (none + r > threshold)))) %>%
    filter(!(id == "ac0" & ((none + y > threshold) | y>threshold))) %>%
    filter(!(id == "ac1" & ((none + r > threshold) | r>threshold))) %>%
    filter(!(id == "ac2" & y > threshold)) %>%
    filter(!(id == "ac3" & r > threshold)) %>%
    filter(!(id == "ind0" & (ry + y > threshold))) %>%
    filter(!(id == "ind1" & (none + y > threshold))) %>%
    rowwise() %>%
    mutate(max=max(ry, r, y, none), min=min(ry, r, y, none), max_diff=max-min) %>%
    filter(!(id == "uncertain0" & max_diff > max_diff_equal)) %>%
    ungroup() %>% 
    select(-min, -max, -max_diff)
  return(df.filtered)     
}

# Quality of the data
# For each participant and trial, compute the distance in RESPONSE to all other participants
# and compute the average distance for this participant from all other participants.
qualityResponses = function(df.prior, save_as){
  df = df.prior %>% 
    select(prolific_id, id, r_norm, question) %>%
    unite(col = "id_quest", "id", "question", remove=FALSE) %>%
    rename(response=r_norm)
  
  distances <- tibble()
  for(proband in df.prior$prolific_id %>% unique()) {
    message(proband)
    res = df %>% filter(prolific_id == proband) %>% ungroup()
    for(stimulus in df$id %>% unique()) {
      dat <- df %>% filter(id == stimulus);
      res_proband = res %>%
        filter(str_detect(string = id_quest, pattern = paste(stimulus, ".*", sep=""))) %>%
        select(id_quest, response) %>% rename(r_proband = response) %>%
        add_column(comparator = proband)
      distances <- bind_rows(distances,
                             left_join(dat, res_proband, by="id_quest") %>%
                               mutate(diff = abs(r_proband - response)));
    }
  }
  distances <- distances %>% filter(comparator != prolific_id) %>%
    group_by(comparator, id, question) %>% mutate(mean_diff=mean(diff))
  df <- distances %>%
    select(comparator, question, mean_diff, id) %>%
    ungroup() %>%
    mutate(question = factor(question, levels=c("bg", "b", "g", "none"))) %>%
    group_by(comparator, question, id) %>% distinct() %>% ungroup()
  
  # average diff for each proband (comparator) + id + question
  stats_all <- df %>% group_by(question, id) %>% 
    mutate(mu=mean(mean_diff), sd=sd(mean_diff)) %>%
    select(-comparator, -mean_diff) %>% distinct() %>% ungroup()
    # mutate(limit_up = mu + sd, limit_low = mu - sd)
  
  df <- left_join(df, stats_all, by=c("question", "id")) %>%
    group_by(question, id)
  message(paste('save data to:', save_as))
  saveRDS(df, save_as)
  return(df)
}


log_likelihood = function(df, cn, par){
  if(cn == "A implies C"){
    df <- df %>% 
          mutate(ll=dbeta(p_c_given_a, par$pos1, par$pos2, log=TRUE) +
                    dbeta(p_c_given_na, par$neg1, par$neg2, log=TRUE) +
                    dbeta(p_a, par$marg1, par$marg2, log=TRUE),
                 cn=cn)
  } else if(cn == "A implies -C") {
    df <- df %>% 
      mutate(ll=dbeta(1-p_c_given_a, par$pos1, par$pos2, log=TRUE) +
                dbeta(1-p_c_given_na, par$neg1, par$neg2, log=TRUE) +
                dbeta(p_a, par$marg1, par$marg2, log=TRUE),
             cn=cn)
  } else if(cn=="C implies A"){
    df <- df %>% 
      mutate(ll=dbeta(p_a_given_c, par$pos1, par$pos2, log=TRUE) +
                dbeta(p_a_given_nc, par$neg1, par$neg2, log=TRUE) +
                dbeta(p_c, par$marg1, par$marg2, log=TRUE),
             cn=cn)
  } else if(cn=="C implies -A"){
    df <- df %>% 
      mutate(ll=dbeta(1-p_a_given_c, par$pos1, par$pos2, log=TRUE) +
                dbeta(1-p_a_given_nc, par$neg1, par$neg2, log=TRUE) +
                dbeta(p_c, par$marg1, par$marg2, log=TRUE),
             cn=cn)
  } else if(cn=="A || C") {
    df <- df %>% 
      mutate(lb= p_a + p_c,
             lb=case_when(lb<=1 ~ 0, TRUE ~ lb-1),
             ub=pmin(p_a, p_c)) %>% 
      mutate(ll=log(dtruncnorm(p_a, 0, 1, par$p_a1, par$p_a2)) +
                log(dtruncnorm(p_c, 0, 1, par$p_c1, par$p_c2)) +
                log(dtruncnorm(AC, a=lb, b=ub, mean=p_a*p_c, sd=0.01)),
             cn=cn)
      # mutate(ll=dbeta(p_a, par$p_a.shape1, par$p_a.shape2, log=TRUE) +
      #           dbeta(p_c, par$p_c.shape1, par$p_c.shape2, log=TRUE),
      #        cn=cn)
  } else {
    stop(paste("likelihood not defined for cn:", cn))
  }
  return(df)
}

formatParams4WebPPL = function(params){
  par=params %>% ungroup() %>% select(-cn) %>% group_by(id) %>% 
    transmute(p_ind=list(c(a1=p_a1, a2=p_a2, c1=p_c1, c2=p_c2)),
              p_dep=list(c(pos1=pos1, pos2=pos2, neg1=neg1, neg2=neg2,
                           marg1=marg1, marg2=marg2))
             )
  par.ind = par %>% filter(str_detect(id, "independent")) %>% select(-p_dep) %>%
    pivot_wider(names_from="id", values_from="p_ind", names_prefix="logL_")
  par.dep = par %>% filter(!str_detect(id, "independent")) %>% select(-p_ind) %>%
    pivot_wider(names_from="id", values_from="p_dep", names_prefix="logL_")
 formatted = bind_cols(par.ind, par.dep) 
 return(formatted)
}




qualityPlots = function(df.quality, save_as, w=10, h=12){
  facet_labels <- c(
    `bg` = "Blue and Green",
    `b` = "Blue but not Green",
    `g` = "Green but not Blue",
    `none` = "Neither Green nor Blue"
  );
  n_pages <- 14/2; # 2 test trials per page!
  for(pa in seq(1, n_pages)) {
    p <- df.quality %>%
      ggplot(aes(y=mean_diff, x=factor(0))) +
      geom_boxplot(outlier.shape = NA) +
      geom_jitter(aes(color=comparator), width = 0.1, alpha = 0.5) +
      geom_hline(aes(yintercept=mu), linetype="dashed", color = "orange", size=.5) +
      # geom_hline(aes(yintercept=limit_up), color = "black", size=.25) +
      # geom_hline(aes(yintercept=limit_low), color = "black", size=.25) +
      # scale_y_continuous(limits=c(-1.1, 1.1), breaks=seq(-1, 1, 0.5)) +
      facet_grid_paginate(id~question, nrow = 2, ncol = 4,
                          labeller = labeller(question = facet_labels),
                          page = pa) +
      ggtitle("Quality of responses per stimulus") +
      theme(axis.ticks.x = element_blank(), axis.text.x = element_blank(),
            legend.position="none") +
      labs(y="average difference to other participants' responses", x="")
    ggsave(filename=paste(save_as, "-", pa, ".png", sep=""), p, width=w, height=h)
    # print(p)
  }
  message(paste('saved plots to:', save_as))
}


add_table_probabilities = function(tables){
  df = tables %>%
    mutate(p_c_given_a=`AC`/(`AC`+`A-C`),
           p_c_given_na=`-AC`/(`-AC`+`-A-C`),
           p_a_given_c=`AC`/(`AC`+`-AC`),
           p_a_given_nc=`A-C`/(`A-C`+`-A-C`),
           p_a=`AC`+`A-C`, p_c=AC+`-AC`,
           theta_ac = (p_c_given_a - p_c_given_na) / (1 - p_c_given_na),
           theta_anc = ((1-p_c_given_a) - (1-p_c_given_na)) / (1 - (1-p_c_given_na)),
           theta_ca = (p_a_given_c - p_a_given_nc) / (1 - p_a_given_nc),
           theta_cna = ((1-p_a_given_c) - (1-p_a_given_nc)) / (1 - (1-p_a_given_nc)),
          );
  return(df)
}

plot_ratings_across_conditions = function(df, title){
  p = df %>% group_by(dir) %>%
    ggplot(aes(x=condition, y=response)) +
    geom_boxplot(aes(color=relation), outlier.shape = NA, position=position_dodge(1)) +
    geom_jitter(aes(color=relation), shape=16, alpha=0.5, width=0, height=0.1) +
    facet_wrap(~dir) +
    theme_classic(base_size = 22) +
    theme(axis.text.x = element_text(size=15), legend.position = "bottom") +
    coord_flip() +
    ggtitle(title)
  return(p)
}


