source(here("R", "joint_experiment", "analysis-utils.R"))

fit.x = seq(0.01, 1-epsilon, by=0.01);
fit.ind.x = seq(-0.99, 1-epsilon, length.out=length(fit.x))
PlotData = function(par.fit, prefix_stimuli, labels, w=12, h=8){
  params = par.fit %>% filter(startsWith(stimulus_id, prefix_stimuli))
  if(prefix_stimuli == "independent"){
    par = params %>% 
      select(cn, stimulus_id, p_a1, p_a2, p_c1, p_c2, p_diff_sd)
    df.fitted = pmap_dfr(par, function(...){
      row = tibble(...)
      fitted = tribble(
      ~x, ~y, ~key, ~id,
      fit.x, dbeta(fit.x, row$p_a1, row$p_a2), "p_a", row$stimulus_id,
      fit.x, dbeta(fit.x, row$p_c1, row$p_c2), "p_c", row$stimulus_id,
      fit.ind.x, dtruncnorm(fit.ind.x, a=-1, b=1, mean=0, sd=row$p_diff_sd),
                         "p_diff", row$stimulus_id
      )
    })  %>% unnest(c(x,y))
    df = TABLES.ind %>% mutate(p_diff=AC-p_a*p_c) %>% 
      pivot_longer(cols=starts_with("p_"), names_to="key", values_to="val") %>%
      group_by(key)
    df = df %>% filter(key %in% c("p_a", "p_c", "p_diff"))
    fn = "fit-independent"
  } else {
    par = params %>% select(-p_a1, -p_a2, -p_c1, -p_c2, -p_diff_sd) %>%
      separate(cn, into=c("cn.params", "stimulus_id.params"), sep="--")
    df.fitted = pmap_dfr(par, function(...){
      row = tibble(...)
      if(startsWith(row$cn.params, "A implies")){
        pos = ifelse(row$cn.params == "A implies C", "p_c_given_a", "p_nc_given_a")
        neg = ifelse(row$cn.params == "A implies C", "p_c_given_na", "p_nc_given_na")
        marg="p_a"
      } else {
        pos = ifelse(row$cn.params == "C implies A", "p_a_given_c", "p_na_given_c")
        neg = ifelse(row$cn.params == "C implies A", "p_a_given_nc", "p_na_given_nc")
        marg = "p_c"
      }
      fitted = tribble(
        ~x, ~y, ~key, ~id,
        fit.x, dbeta(fit.x, row$pos1, row$pos2), pos, row$stimulus_id,
        fit.x, dbeta(fit.x, row$neg1, row$neg2), neg, row$stimulus_id,
        fit.x, dbeta(fit.x, row$marg1, row$marg2), marg, row$stimulus_id
      ) %>% unnest(c(x,y))
    });
    
    keys = df.fitted %>% select(id, key) %>% distinct()
    df = TABLES.dep %>% filter(id!="ind2") %>% 
      pivot_longer(cols=starts_with("p_"), names_to="key", values_to="val") %>%
      group_by(key)
    df = right_join(df, keys)
    fn="fit-dependent"
  }
  # gghistogram(df, x = "val", add = "mean", rug = TRUE, fill = "key", bins=20)
  df = df %>% mutate(key=factor(key, levels=names(labels), labels=(!! labels)))
  df.fitted = df.fitted %>% mutate(key=factor(key, levels=names(labels), labels=(!! labels)))
  p <- df %>% ggplot() +
    geom_histogram(aes(x=val, fill=id), alpha=0.5, bins=20) +
    geom_jitter(aes(x=val, y=0, color=id), height = 0, alpha=0.5) +
    geom_point(data=df.fitted, aes(x=x, y=y), color='black', alpha=0.5, size=0.5) +
    theme_classic(base_size=18) +
    facet_wrap(~key, scales = "free") +
    theme(legend.position="bottom", axis.ticks.x=element_line(size=8),
          strip.text = element_text(size=10)) +
    facet_grid(key~id, scales="free")
  
  ggsave(paste(PLOT.dir, SEP, fn, ".png", sep=""),
         p, width=w, height=h)
  return(p)
}

# path.params = "./../MA-project/conditionals/data/params-ll-best-cn.rds"
# fits = readRDS(path.params)
# PlotData(fits, "if", c(p_a_given_c="P(A|C)", p_a_given_nc="P(A|¬C)",
#                        p_c_given_a="P(C|A)", p_c_given_na="P(C|¬A)",
#                        p_a="P(A)", p_c="P(C)"))
# PlotData(fits, "independent", c(p_a="P(A)", p_c="P(C)", p_diff="P(A,C)-P(A)*P(C)"))
