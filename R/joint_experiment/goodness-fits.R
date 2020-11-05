source("R/joint_experiment/my-utils.R")
goodness_fits = function(n){
  N=30
  fn = "beta-fits-by-stimulus.csv"
  params = read_csv(
    paste(RESULT.dir, fn, sep=.Platform$file.sep)
  ) %>% group_by(cn, id)
  # likelihood of empirical data
  # 1.independent tables
  par.cn = params %>% filter(cn == "A || C")
  ll.ind = map_dfr(IDS.ind, function(id){
    par.cn = par.cn %>% filter(id == (!! id));
    TABLES.ind %>% filter(id == (!! id)) %>% 
      log_likelihood("A || C", par.cn) %>% select(ll, cn, id, prolific_id) %>%
      summarize(ll_sample = sum(ll), .groups = "keep") %>%
      add_column(cn="A || C", id=id)
  });
  # 2.dependent tables
  par.cn = params %>% filter(cn == "A implies C")
  ll.dep=map_dfr(IDS.dep, function(id){
    par = par.cn %>% filter(id==(!! id));
    TABLES.dep %>% filter(id == (!! id)) %>%
    log_likelihood("A implies C", par) %>% select(ll, cn) %>%
    summarize(ll_sample=sum(ll), .groups="keep") %>%
    add_column(cn="A implies C", id=id)
  });
  ll.empirical = bind_rows(ll.ind, ll.dep)
  # Sample n times N=30 values for each of the distinctive numbers mapping
  # to a probability table
  p_values = pmap_dfr(
    params, function(...){
      par = tibble(...)
      print(par$cn)
      # empirical likelihood for all participants data for current cn(+id)
      # given fitted params
      ll.obs = ll.empirical %>%
        filter(cn == par$cn & id == par$id) %>%
        pull(ll_sample)
      # sample n times N (#participants,30) tables and compute log likelihood
      if(par$cn == "A || C"){
        probs = sample_probs_independent(N*n, par) %>%
          add_column(idx=rep(seq(1,n), N))
      } else {
        probs = sample_probs_dependent(N*n, par) %>%
          rename(p_c_given_na=p_neg, p_c_given_a=p_pos, p_a=p_marg) %>%
          add_column(idx=rep(seq(1,n), N))
      }
      ll.simulated = probs %>% group_by(idx) %>% log_likelihood(par$cn, par) %>%
        summarize(s=sum(ll), .groups="keep");
      p.val = (ll.simulated < ll.obs) %>% sum()/n
      tibble(id=par$id, cn=par$cn, p.val=p.val, n=n)
    }) ;
  return(p_values)
}
res.goodness = goodness_fits(10**4) %>% arrange(desc(p.val));
saveRDS(res.goodness, paste(RESULT.dir, "simulated-p-values.rds", sep=.Platform$file.sep))

