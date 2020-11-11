
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

standardized.sentences = list(
  # bg = "the blue block and the green block fall",
  # none = "neither the blue block nor the green block fall",
  bg = "both blocks fall",
  none = "neither block falls",
  if_gb = "if the green block falls the blue block falls",
  if_bg = "if the blue block falls the green block falls",
  g = "the green block falls but the blue block does not fall",
  b = "the blue block falls but the green block does not fall"
);

# (the green and the blue = the blue and the green, etc.)
standardize_sentences = function(df.test){
  s.pos.and = standardized.sentences$bg
  s.neg.and = standardized.sentences$none
  s.pos.if_green = standardized.sentences$if_gb
  s.pos.if_blue = standardized.sentences$if_bg
  s.pos_neg.and_gb = standardized.sentences$g
  s.pos_neg.and_bg = standardized.sentences$b
  
  df.test = df.test %>% mutate(response = as.character(response))
  test.standardized <- df.test %>%
    summarize_utts(c("and"), c("does not"), s.pos.and) %>%
    summarize_utts(c("neither"), c("does not"), s.neg.and) %>%
    summarize_utts(c("if the green block"), c("does not"), s.pos.if_green) %>%
    summarize_utts(c("if the blue block"), c("does not"), s.pos.if_blue) %>%
    summarize_utts(c("and", "the green block falls", "the blue block does not"), c(),
                   s.pos_neg.and_gb) %>%
    summarize_utts(c("and", "the blue block falls", "the green block does not"), c(),
                   s.pos_neg.and_bg);
    # mutate(response=case_when(str_detect(response, "neither") ~ "neither block falls",
    #                           str_detect(response, 'and') ~ "both blocks fall",
    #                           TRUE ~ response))
  utterances <- test.standardized %>% select(response) %>% unique()
  print('standardized responses:')
  print(utterances)
  return(test.standardized)
}


# @todo: plot empirical probabilities on top nicht als absoluten wert, 
# sondern mit differenzen
plotProductionTrials <- function(df.production.means, target_dir, min=0, dat.model=tibble(),
                                 dat.prior_empirical=tibble()){
  ids = df.production.means$id %>% unique()
  n = ids %>% length();
  brks=seq(0, 1, by=0.1)
  
  df.production.means <- df.production.means %>% filter(ratio>min)
    for(i in seq(1, n)) {
      df <- df.production.means %>% filter(id == ids[[i]]) %>%
        ungroup() %>% select(-prolific_id) %>% distinct() %>% 
        mutate(response=fct_reorder(response, desc(-ratio)))
      p <- df %>% filter(id == ids[[i]]) %>%
        ggplot(aes(y=response, x=ratio)) +
        geom_bar(stat="identity") +
        theme_bw() +
        theme(text = element_text(size=22),
              axis.text.x=element_text(angle=45, vjust = 0.5)) +
        labs(x="ratio participants", y="response", title = ids[[i]]) +
        scale_y_discrete(labels = function(ylab) str_wrap(ylab, width = 27.5))
      if(nrow(dat.model) != 0){
        p <- p + 
          geom_point(data=dat.model %>% filter(id == ids[[i]] & ratio > 0),
                     aes(x=ratio, y=response, shape=cn), color='red', size=2)
      }
      if(nrow(dat.prior_empirical) != 0){
        priors = left_join(df.production.means %>% select(prolific_id, id, response),
          dat.prior_empirical %>% select(prolific_id, id, utterance, prob, val),
          by=c("prolific_id", "id")) %>%  filter(id == ids[[i]] & response==utterance) 
        priors.mean = priors %>% group_by(response) %>%
          summarize(m=mean(val), .groups="drop") %>%
          mutate(response=factor(response))
        p <- p + 
          geom_jitter(data=priors,
                      width=0, height=0.1,
                     aes(x=val, y=response, color=prolific_id), size=2, alpha=0.5) +
          geom_point(data=priors.mean, aes(x=m, y=response), shape='*', size=8, color='orange') +
          guides(color=FALSE)
      }
      ggsave(paste(target_dir,
                   paste(ids[[i]], ".png", sep=""), sep=.Platform$file.sep), p,
             width=8, height=10)
      
      print(p)
    }
}

translate_utterances = function(speaker.model){
  df.green_blue <- speaker.model %>%
    # filter(str_detect(stimulus, "if1_uh|if1_uu|if2_hh|if2_ll|independent_ul")) %>%
    mutate(response=case_when(
      str_detect(response, "-C") ~ str_replace(response, "-C", "the blue block does not fall"),
      str_detect(response, "C") ~ str_replace(response, "C", "the blue block falls"),
      TRUE ~ response)) %>%
    mutate(response=case_when(
      str_detect(response, "-A") ~ str_replace(response, "-A", "the green block does not fall"),
      str_detect(response, "A") ~ str_replace(response, "A", "the green block falls"),
      TRUE ~ response));
  
  df.blue_green <- speaker.model %>%
    # filter(!str_detect(stimulus, "if1_uh|if1_uu|if2_hh|if2_ll|independent_ul")) %>%
    mutate(response=case_when(
      str_detect(response, "-A") ~ str_replace(response, "-A", "the blue block does not fall"),
      str_detect(response, "A") ~ str_replace(response, "A", "the blue block falls"),
      TRUE ~ response)) %>%
    mutate(response=case_when(
      str_detect(response, "-C") ~ str_replace(response, "-C", "the green block does not fall"),
      str_detect(response, "C") ~ str_replace(response, "C", "the green block falls"),
      TRUE ~ response));
  
  df <- bind_rows(df.blue_green, df.green_blue) %>%
    mutate(response=case_when(str_detect(response, " >") ~
                                paste("if", str_replace(response, " >", "")),
                              TRUE ~ response)) %>%
    mutate(response=case_when(str_detect(response, "likely") ~ str_replace(response, "falls", "might fall"),
                              TRUE ~ response)) %>%
    mutate(response=case_when(str_detect(response, "likely") ~ str_replace(response, "does not fall", "might not fall"),
                              TRUE ~ response)) %>% 
    mutate(response=case_when(str_detect(response, "might") ~ str_replace(response, "likely", ""),
                              TRUE ~ response)) %>%
    mutate(response=case_when(response=="the green block falls and the blue block falls" ~ "both blocks fall",
                              response=="the blue block falls and the green block falls" ~ "both blocks fall",
                              response=="the green block does not fall and the blue block does not fall" ~
                                "neither block falls",
                              response=="the blue block does not fall and the green block does not fall" ~
                                "neither block falls",
                              TRUE ~ response)) %>%
    mutate(response=str_replace(response, "and", "but")) %>%
    mutate(response=case_when(
      response=="the green block does not fall but the blue block falls" ~
        "the blue block falls but the green block does not fall",
      response=="the blue block does not fall but the green block falls" ~
        "the green block falls but the blue block does not fall",
      TRUE ~ response)) %>%
    mutate(response=str_trim(response)) %>%
    ungroup() 
  return(df)
}



