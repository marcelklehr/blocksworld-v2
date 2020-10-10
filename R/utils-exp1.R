plotSliderRatings <- function(data, questions, labels, cluster_by="g"){
  dat <- data %>% ungroup() %>%
    mutate(question = factor(question, levels = (!!questions)),
           response=as.numeric(response))
  
  df <- cluster_responses(dat, cluster_by) %>%
    group_by(question, id) %>% mutate(mu=mean(response), med=median(response));
  
  ids <- df$id %>% unique() %>% as.character()
  # ids <- c("independent_hh")
  for (id in ids){
    p <- df  %>% filter(id == (!! id)) %>% 
      ggplot(aes(x=response, y=factor(0))) +
      geom_jitter(width=0, height = 0.1, alpha=0.5, aes(shape = cluster, colour = prolific_id)) +
      geom_point(mapping=aes(x=med, y=factor(0)),  shape=8, color = "red") +
      # geom_vline(aes(xintercept=med), color = "red", size=0.5) +
      geom_vline(aes(xintercept=0), color = "grey", size=0.2, linetype='dashed') +
      geom_vline(aes(xintercept=0.25), color = "grey", size=0.2, linetype='dashed') +
      geom_vline(aes(xintercept=0.5), color = "gray45", size=0.5, linetype='dashed') +
      geom_vline(aes(xintercept=0.75), color = "grey", size=0.2, linetype='dashed') +
      geom_vline(aes(xintercept=1), color = "grey", size=0.2, linetype='dashed') +
      scale_x_continuous(limits=c(-0.2, 1.2),
                         breaks=c(0, 0.25, 0.5, 0.75, 1)) +
      labs(x="estimates probability", y="", title=id) +
      theme_bw() +
      facet_wrap(~question, nrow=2, ncol=2, labeller = as_labeller(labels)) + 
      theme(axis.text.y=element_blank(),
            axis.ticks.y =element_blank(),
            text = element_text(size=14),
            legend.position = "right") +
      guides(color=FALSE)
    print(p)
  }
  
}