source("R/joint_experiment/generate-prior-based-tables.R")
goodness_fits = function(n, fn, N=30){
  params = readRDS(
    paste("../MA-project/conditionals/data", fn, sep=.Platform$file.sep)
  ) %>% group_by(cn, stimulus_id) %>% 
    filter(stimulus_id != "ind2") %>%
    rename(cn_params=cn) %>%
    mutate(cn=str_split(cn_params, "--")[[1]][[1]])
  
  # likelihood of empirical data
  ll.empirical = params %>% ungroup() %>%  
    select(stimulus_id, cn_params, cn, ll.sample)

  # Sample n times N=30 values for each of the distinctive probabilities mapping
  # to a probability table
  p_values = pmap_dfr(
    params, function(...){
      par = tibble(...)
      print(par$stimulus_id)
      # empirical likelihood for all participants data for current cn(+id)
      # given fitted params
      ll.obs = ll.empirical %>%
        filter(cn_params == par$cn_params & stimulus_id == par$stimulus_id) %>%
        pull(ll.sample)
      # sample n times N (#participants,30) tables and compute log likelihood
      if(par$cn ==  "A || C"){
        probs = sample_probs_independent(N*n, par) %>%
          add_column(idx=rep(seq(1,n), N))
      } else {
        probs = sample_probs_dependent(N*n, par) %>% 
          add_column(idx=rep(seq(1,n), N))
        if(par$cn=="A implies C"){
          probs = probs %>% rename(p_c_given_na=p_neg, p_c_given_a=p_pos, p_a=p_marg)
        }else if(par$cn=="A implies -C"){
          probs = probs %>% rename(p_nc_given_na=p_neg, p_nc_given_a=p_pos, p_a=p_marg)
        }else if(par$cn=="C implies A"){
          probs = probs %>% rename(p_a_given_nc=p_neg, p_a_given_c=p_pos, p_c=p_marg)
        }else if(par$cn=="A implies -C"){
          probs = probs %>% rename(p_nc_given_na=p_neg, p_nc_given_a=p_pos, p_c=p_marg)
        }
      }
      ll.simulated = probs %>% group_by(idx) %>% log_likelihood(par$cn, par) %>%
        summarize(s=sum(ll), .groups = "drop") %>% select(-idx);
      p.val = (ll.simulated < ll.obs) %>% sum()/n
      ll.simulated %>%
        mutate(stimulus_id=par$stimulus_id, cn_params=par$cn_params, p.val=p.val, n=n)
      # tibble(stimulus_id=par$stimulus_id, cn_params=par$cn_params, p.val=p.val, n=n)
    }) ;
  return(p_values)
}
res.goodness = goodness_fits(10**4, "params-ll-best-cn.rds") %>% arrange(desc(p.val));
res.goodness %>% select(-s) %>% distinct()
saveRDS(res.goodness, paste(RESULT.dir, "simulated-p-values.rds", sep=.Platform$file.sep))

