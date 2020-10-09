
summarize_utts = function(df, w_pos, w_neg, utt){
  for(w in w_pos) {
    df[[paste('word', w, sep='_')]] = with(df, str_detect(response, w))
  }
  
  for(w in w_neg) {
    df[[paste('word_not', w, sep='_')]] = with(df, !str_detect(response, w))
  }
  
  dat <- df %>% group_by(prolific_id, id) %>% 
    pivot_longer(cols=starts_with('word_'), names_to='word',
                 values_to = "has_word") %>% 
    group_by(prolific_id, id) %>%
    # filter(has_word) %>% 
    mutate(has_all=sum(has_word),
           response=
             case_when(has_all ==  length(w_pos) + length(w_neg) ~ utt,
                       TRUE ~ response)
           ) %>%
    select(-has_all, -word, -has_word) %>% ungroup() %>% distinct()
  return(dat)
}


# (the green and the blue = the blue and the green, etc.)
standardize_sentences = function(df.test){
  s.pos.and = "the blue block and the green block fall"
  s.neg.and = "neither the blue block nor the green block fall"
  s.pos.if_green = "if the green block falls the blue block falls"
  s.pos.if_blue = "if the blue block falls the green block falls"
  s.pos_neg.and_gb = "the green block falls but the blue block does not fall"
  s.pos_neg.and_bg = "the blue block falls but the green block does not fall"
  
  test.standardized <- df.test %>%
    summarize_utts(c("and"), c("does not"), s.pos.and) %>%
    summarize_utts(c("neither"), c("does not"), s.neg.and) %>%
    summarize_utts(c("if the green block"), c("does not"), s.pos.if_green) %>%
    summarize_utts(c("if the blue block"), c("does not"), s.pos.if_blue) %>%
    summarize_utts(c("and", "the green block falls", "the blue block does not"), c(),
                   s.pos_neg.and_gb) %>%
    summarize_utts(c("and", "the blue block falls", "the green block does not"), c(),
                   s.pos_neg.and_bg) %>%
    mutate(response=case_when(str_detect(response, "neither") ~ "neither block falls",
                              str_detect(response, 'and') ~ "both blocks fall",
                              TRUE ~ response))
  utterances <- test.standardized %>% select(response) %>% unique()
  print(utterances)
  return(test.standardized)
}


plotProductionTrials <- function(dat, target_dir, min=0, dat.model=tibble(),
                                 dat.prior_empirical=tibble()){
  
  ids = dat$id %>% unique()
  n = ids %>% length();
  brks=seq(0, 1, by=0.1)
  
  dat <- dat %>% filter(ratio>min)
    for(i in seq(1, n)) {
      df <- dat %>% filter(id == ids[[i]]) %>%
        mutate(response=fct_reorder(response, desc(-ratio)))
      p <- df %>% filter(id == ids[[i]]) %>%
        ggplot(aes(x=ratio, y=response)) +
        geom_bar(stat="identity") +
        theme_bw() +
        theme(text = element_text(size=22),
              axis.text.x=element_text(angle=45, vjust = 0.5)) +
        labs(x="ratio participants", y="response", title = ids[[i]]) +
        scale_y_discrete(labels = function(ylab) str_wrap(ylab, width = 27.5))
      if(nrow(dat.model) != 0){
        p <- p + 
          geom_point(data=dat.model %>% filter(endsWith(id, ids[[i]])),
                     aes(x=ratio, y=response, color=cn), shape='*', size=10, alpha=0.5)
      }
      if(nrow(dat.prior_empirical) != 0){
        utterances = df$response %>% unique()
        responses = df.production %>%  filter(id == ids[[i]]) %>%  
          select(prolific_id, response)
        empirical = dat.prior_empirical %>%
          filter(id==ids[[i]] & utterance %in% utterances)
        dat.map = left_join(empirical, responses, by="prolific_id") %>%
          filter(response == utterance);
        p <- p + 
          geom_jitter(data=dat.map,
                      width=0, height=0.1,
                     aes(x=val, y=response, color=prolific_id), size=2, alpha=0.5)
      }
      ggsave(paste(target_dir,
                   paste(ids[[i]], ".png", sep=""), sep=.Platform$file.sep), p,
             width=8, height=10)
      
      print(p)
    }
}
