
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
  s.pos.prob_green = "probably the green block falls"
  s.pos.prob_blue = "probably the blue block falls"
  s.pos_neg.and_gb = "the green block falls but the blue block does not fall"
  s.pos_neg.and_bg = "the blue block falls but the green block does not fall"
  
  test.standardized <- df.test %>%
    summarize_utts(c("and"), c("does not"), s.pos.and) %>%
    summarize_utts(c("neither"), c("does not"), s.neg.and) %>%
    summarize_utts(c("if the green block"), c("does not"), s.pos.if_green) %>%
    summarize_utts(c("if the blue block"), c("does not"), s.pos.if_blue) %>%
    summarize_utts(c("the green block probably"), c("does not"), s.pos.prob_green) %>%
    summarize_utts(c("the blue block probably"), c("does not"), s.pos.prob_blue) %>%
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


plotProductionTrials <- function(dat, target_dir, trials="all", min=0,
                                 responses="all", dat.model=tibble()){
  ids = dat$id %>% unique()
  n = ids %>% length();
  brks=seq(0, 1, by=0.1)
  
  dat <- dat %>% filter(ratio>min)
  if(trials=="all"){
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
      ggsave(paste(target_dir,
                   paste(ids[[i]], ".png", sep=""), sep=.Platform$file.sep), p,
             width=8, height=10)
      
      print(p)
    }
  } else if(responses != "all") {
    dat <- dat %>%
      filter(response %in% responses) %>%
      group_by(id) %>% summarize(ratio=sum(ratio)) %>%
      add_column(response = "literal/probably+literal") %>%
      mutate(response = as.factor(response))
    
    # if(trials != "all"){
    #   dat <- dat %>%
    #     filter(str_detect(id, trials))
    # }
    p <-  dat %>%
      mutate(response=fct_rev(fct_relevel(response, sort))) %>% 
      ggplot(aes(x=ratio, y=response)) +
      geom_bar(aes(fill=id), stat="identity", position=position_dodge(preserve="single")) +
      theme_bw() +
      theme(text = element_text(size=22),
            axis.text.x=element_text(angle=45, vjust = 0.5),
            legend.position="top") +
      labs(x="percentage of participants who built utterance", y="built utterance") +
      scale_y_discrete(labels = function(ylab) str_wrap(ylab, width = 27.5))
    print(p)
  }
}



# w_pos = c("and")
# w_neg = c("does not")
# 
# dat <- df %>% select(response) %>% distinct()
# 
# dat <- df %>% 
#   filter(str_detect(response, paste(w_pos, collapse='|')) &
#          !str_detect(response, paste(w_neg, collapse="|"))) 
#                      
