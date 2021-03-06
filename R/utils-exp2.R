
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
  bg = "both blocks fall",
  none = "neither block falls",
  g = "green falls but blue does not fall",
  b = "blue falls but green does not fall",
  
  if_gb = "if green falls blue falls",
  if_gnb = "if green falls blue does not fall",
  if_bg = "if blue falls green falls",
  if_bng = "if blue falls green does not fall",
  
  if_nbng = "if blue does not fall green does not fall",
  if_nbg = "if blue does not fall green falls",
  if_ngb = "if green does not fall blue falls",
  if_ngnb = "if green does not fall blue does not fall",
  
  might_g = "green might fall",
  might_b = "blue might fall",
  might_ng = "green might not fall",
  might_nb = "blue might not fall",
  
  only_g = "green falls",
  only_b = "blue falls",
  only_ng = "green does not fall",
  only_nb = "blue does not fall"
);

# (the green and the blue = the blue and the green, etc.)
standardize_sentences = function(df.test){
  df.test = df.test %>% mutate(response = as.character(response))
  test.standardized <- df.test %>%
    summarize_utts(c("and"), c("does not"), standardized.sentences$bg) %>%
    mutate(response=str_replace(response, "and", "but")) %>% 
    summarize_utts(c("neither"), c("does not"), standardized.sentences$none) %>%
    summarize_utts(c("but", "green falls", "blue does not"), c(), standardized.sentences$g) %>%
    summarize_utts(c("but", "blue falls", "green does not"), c(), standardized.sentences$b) %>% 
    summarize_utts(c("if green falls"), c("does not"), standardized.sentences$if_gb) %>%
    summarize_utts(c("if blue falls"), c("does not"), standardized.sentences$if_bg) %>%
    summarize_utts(c("if green does not fall", "blue does not fall"), c(),
                   standardized.sentences$if_ngnb) %>%
    summarize_utts(c("if blue does not fall", "green does not fall"), c(),
                   standardized.sentences$if_nbng) %>%
    summarize_utts(c("if blue falls", "green does not fall"), c(),
                   standardized.sentences$if_bng) %>%
    summarize_utts(c("if green does not fall", "blue falls"), c(),
                   standardized.sentences$if_ngb) %>% 
    summarize_utts(c("if green falls", "blue does not fall"), c(),
                   standardized.sentences$if_gnb) %>%
    summarize_utts(c("if blue does not fall", "green falls"), c(),
                   standardized.sentences$if_nbg) %>%
    
    summarize_utts(c("but", "the green block falls", "the blue block does not"),
                   c(), standardized.sentences$g) %>%
    summarize_utts(c("but", "the blue block falls", "the green block does not"),
                   c(), standardized.sentences$b) %>%
    summarize_utts(c("if the green block falls"), c("does not"), standardized.sentences$if_gb) %>%
    summarize_utts(c("if the blue block falls"), c("does not"), standardized.sentences$if_bg) %>%
    summarize_utts(c("if the green block does not fall", "the blue block does not fall"), c(),
                   standardized.sentences$if_ngnb) %>%
    summarize_utts(c("if the blue block does not fall", "the green block does not fall"), c(),
                   standardized.sentences$if_nbng) %>%
    
    summarize_utts(c("if the blue block falls", "the green block does not fall"), c(),
                   standardized.sentences$if_bng) %>%
    summarize_utts(c("if the green block does not fall", "the blue block falls"), c(),
                   standardized.sentences$if_ngb) %>% 
    summarize_utts(c("if the green block falls", "the blue block does not fall"), c(),
                   standardized.sentences$if_gnb) %>%
    summarize_utts(c("if the blue block does not fall", "the green block falls"), c(),
                   standardized.sentences$if_nbg) %>%
    
    summarize_utts(c("the green block might fall"), c(), standardized.sentences$might_g) %>%
    summarize_utts(c("the blue block might fall"), c(), standardized.sentences$might_b) %>%
    summarize_utts(c("the green block might not fall"), c(), standardized.sentences$might_ng) %>%
    summarize_utts(c("the blue block might not fall"), c(), standardized.sentences$might_nb) %>%
    summarize_utts(c("the green block falls"), c(), standardized.sentences$only_g) %>%
    summarize_utts(c("the blue block falls"), c(), standardized.sentences$only_b) %>%
    summarize_utts(c("the green block does not fall"), c(), standardized.sentences$only_ng) %>%
    summarize_utts(c("the blue block does not fall"), c(), standardized.sentences$only_nb);
    
  utterances <- test.standardized %>% select(response) %>% unique()
  print('standardized responses:')
  print(utterances)
  return(test.standardized)
}

# translate A/C-responses to real colors
translate_utterances = function(speaker.model, group="bg"){
  mapping = tribble(~group, ~A, ~`-A`, ~C, ~`-C`, 
                    "gb", "green falls", "green does not fall",
                    "blue falls", "blue does not fall",
                    "bg", "blue falls", "blue does not fall",
                    "green falls", "green does not fall"
  ) %>% filter(group == (!! group))
  
  df <- speaker.model %>%
    mutate(response=case_when(
      str_detect(response, "-C") ~ str_replace(response, "-C", mapping$`-C`),
      str_detect(response, "C") ~ str_replace(response, "C", mapping$`C`),
      TRUE ~ response)) %>%
    mutate(response=case_when(
      str_detect(response, "-A") ~ str_replace(response, "-A", mapping$`-A`),
      str_detect(response, "A") ~ str_replace(response, "A", mapping$`A`),
      TRUE ~ response))
  df = df %>% 
    mutate(response=case_when(str_detect(response, " >") ~
                                paste("if", str_replace(response, " >", "")),
                              TRUE ~ response)) %>%
    mutate(response=case_when(str_detect(response, "likely") ~ str_replace(response, "falls", "might fall"),
                              TRUE ~ response)) %>%
    mutate(response=case_when(str_detect(response, "likely") ~ str_replace(response, "does not fall", "might not fall"),
                              TRUE ~ response)) %>% 
    mutate(response=case_when(str_detect(response, "might") ~ str_replace(response, "likely", ""),
                              TRUE ~ response)) %>%
    mutate(response=case_when(response=="green falls and blue falls" ~ standardized.sentences$bg,
                              response=="blue falls and green falls" ~ standardized.sentences$bg,
                              response=="green does not fall and blue does not fall" ~
                                standardized.sentences$none,
                              response=="blue does not fall and green does not fall" ~
                                standardized.sentences$none,
                              TRUE ~ response)) %>%
    mutate(response=str_replace(response, "and", "but")) %>%
    mutate(response=case_when(
      response=="green does not fall but blue falls" ~
        "blue falls but green does not fall",
      response=="blue does not fall but green falls" ~
        "green falls but blue does not fall",
      TRUE ~ response)) %>%
    mutate(response=str_trim(response)) %>%
    ungroup() 
  return(df)
}

plotProductionTrials <- function(df.production.means, target_dir, min=0,
                                 dat.prior_empirical=tibble()){
  ids = df.production.means$id %>% unique()
  n = ids %>% length();
  brks=seq(0, 1, by=0.1)
  
  df.production.means <- df.production.means %>% filter(ratio>min)
    for(i in seq(1, n)) {
      df <- df.production.means %>% filter(id == ids[[i]]) %>%
        ungroup() %>%
        select(-prolific_id) %>% distinct() %>%
        mutate(response=fct_reorder(response, ratio))
      p <- df %>%
        ggplot(aes(y=response, x=ratio)) +
        geom_bar(aes(fill=predictor), stat="identity",
                 position=position_dodge2(preserve="single")) +
        # geom_errorbar(data=df %>% filter(id==ids[[i]] & predictor=="model"),
        #               aes(xmin=ratio-sd, xmax=ratio+sd)) +
        theme_bw() +
        theme(text = element_text(size=20),
              axis.text.x=element_text(angle=45, vjust = 0.5)) +
        labs(x="ratio participants", y="response", title = ids[[i]]) +
        scale_y_discrete(labels = function(ylab) str_wrap(ylab, width = 27.5))
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

plotSliderRatingsAndUtts <- function(dat, target_dir){
  stimuli = dat$id %>% unique()
  participants = dat$prolific_id %>% unique()
  df = dat %>% group_by(prolific_id, id, utterance) %>%
    mutate(utterance=factor(utterance, levels=levels.responses))
  brks=seq(0, 1, by=0.1)
  for(pid in participants){
    df.pid = df %>% filter(prolific_id == (!! pid))
    target = paste(target_dir, pid, sep=SEP)
    dir.create(target)
    for(stimulus in stimuli) {
      df.stim <- df.pid %>%
        filter(id == (!! stimulus)) %>%
        arrange(human_exp1)
      levels.utt = df.stim$utterance %>% unique()
      uttered = df.stim %>% filter(!is.na(human_exp2)) %>% ungroup() %>% 
        select(human_exp2, prolific_id, id, utterance) %>% distinct()
      
      df.stim = df.stim %>%
        mutate(utt.col=case_when(
          utterance %in% c(standardized.sentences$bg,
                           standardized.sentences$none,
                           standardized.sentences$b,
                           standardized.sentences$g) ~ "red",
          TRUE ~ "black"),
          utt.face = case_when(utterance == uttered$utterance ~ "bold",
                                TRUE ~ "plain"),
          utterance=factor(utterance, levels=levels.utt)) 

        p <- df.stim %>%
          ggplot() +
          geom_bar(aes(y=utterance, x=human_exp1), stat="identity") +
          geom_vline(aes(xintercept=0.7), color="grey", linetype='dashed') +
          geom_point(data=uttered, aes(x=human_exp2, y=utterance),
                     color='orange', size=2) +
          theme_bw() +
          theme(text = element_text(size=20),
                axis.text.x=element_text(angle=45, vjust = 0.5),
                axis.text.y=element_text(color=df.stim$utt.col, face=df.stim$utt.face)) +
          labs(x="rated probability", y="response", title = stimulus)
      ggsave(paste(target, paste(stimulus, "-", pid, ".png", sep=""), sep=SEP),
             p ,width=8, height=9)
    }
  }
}

plotRatingsAndModel <- function(df, target_dir){
  stimuli = df$stimulus_id %>% unique()
  df.long = df %>% filter(!is.na(model_exp2)) %>% 
    select(-table_id) %>% distinct() %>% 
    group_by(prolific_id, stimulus_id, response, cn) %>%
    pivot_longer(cols=c("model_exp2", "human_exp1"),
                 names_to="predictor", values_to="probs") %>%
    group_by(predictor, stimulus_id, prolific_id, response) %>%
    mutate(response=factor(response, levels=levels.responses))
  brks=seq(0, 1, by=0.1)
  for(stimulus in stimuli) {
    dat <- df.long %>% filter(stimulus_id == stimulus & !is.na(probs)) %>% distinct()
    uttered = dat %>% filter(!is.na(human_exp2)) %>% ungroup() %>% 
      select(human_exp2, prolific_id, stimulus_id, response) %>% distinct()
    p <- dat %>%
      ggplot(aes(y=response, x=probs)) +
      geom_bar(aes(fill=predictor), stat="identity",
               position=position_dodge2(preserve="single")) +
      geom_vline(aes(xintercept=0.8), color="grey", linetype='dashed') +
      geom_point(data=uttered, aes(x=human_exp2, y=response), color='orange', size=5) +
      facet_wrap(~prolific_id) +
      theme_bw() +
      theme(text = element_text(size=20),
            axis.text.x=element_text(angle=45, vjust = 0.5)) +
      labs(x="ratio participants", y="response", title = stimulus)# +
      # scale_y_discrete(labels = function(ylab) str_wrap(ylab, width = 27.5))
    ggsave(paste(target_dir,
                 paste(stimulus, "-with-model.png", sep=""), sep=.Platform$file.sep), p,
           width=15, height=15)
    
    print(p)
  }
}
