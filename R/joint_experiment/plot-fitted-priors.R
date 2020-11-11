source("R/joint_experiment/my-utils.R")

fit.x = seq(0+epsilon, 1-epsilon, by=epsilon);

PlotData = function(par.fit, cn, w=12, h=8){
  if(cn == "A || C"){
    par = par.fit %>% filter(cn=="A || C") %>% 
      select(cn, id, p_a.shape1, p_a.shape2, p_c.shape1, p_c.shape2)
    if(by_stimulus) par = par %>% filter(str_detect(id, "independent"))
    df.fitted = pmap_dfr(par, function(...){
      row = tibble(...)
      fitted = tribble(
      ~x, ~y, ~key, ~id,
      fit.x, dtruncnorm(fit.x, 0, 1, row$p_a.shape1, row$p_a.shape2), "p_a", row$id,
      fit.x, dtruncnorm(fit.x, 0, 1, row$p_c.shape1, row$p_c.shape2), "p_c", row$id
    ) %>% unnest(c(x,y))
    });
    df = TABLES.ind %>%
      pivot_longer(cols=starts_with("p_"), names_to="key", values_to="val") %>%
      group_by(key)
    df = df %>% filter(key %in% c("p_a", "p_c"))
    fn = "fit-independent"
  } else {
    par = par.fit %>% filter(cn == (!! cn)) %>%
      select(-p_a.shape1, -p_a.shape2, -p_c.shape1, -p_c.shape2)
    df.fitted = pmap_dfr(par, function(...){
      row = tibble(...)
      fitted = tribble(
        ~x, ~y, ~key, ~id,
        fit.x, dbeta(fit.x, row$pos.shape1, row$pos.shape2), "p_c_given_a", row$id,
        fit.x, dbeta(fit.x, row$neg.shape1, row$neg.shape2), "p_c_given_na", row$id,
        fit.x, dbeta(fit.x, row$marg.shape1, row$marg.shape2), "p_a", row$id
      ) %>% unnest(c(x,y))
    });
    df = TABLES.dep %>%
      pivot_longer(cols=starts_with("p_"), names_to="key", values_to="val") %>%
      group_by(key) %>% filter(key %in% c("p_c_given_a", "p_c_given_na", "p_a"))
    fn="fit-dependent"
  }
  # gghistogram(df, x = "val", add = "mean", rug = TRUE, fill = "key", bins=20)
  p <- df %>% ggplot() +
    geom_histogram(aes(x=val, fill=id), alpha=0.5, bins=20) +
    geom_jitter(aes(x=val, y=0, color=id), height = 0, alpha=0.5) +
    geom_point(data=df.fitted, aes(x=x, y=y), color='black', alpha=0.5, size=0.5) +
    theme_classic() +
    facet_wrap(~key, scales = "free") +
    theme(legend.position="bottom")
  if(by_stimulus) p = p + facet_grid(key~id, scales="free")
  
  ggsave(paste(PLOT.dir, SEP, fn, ".png", sep=""),
         p, width=w, height=h)
  return(p)
}

fits = read_csv(paste(RESULT.dir, "beta-fits-by-stimulus.csv", sep=.Platform$file.sep))
PlotData(fits, "A implies C")
PlotData(fits, "A || C")
