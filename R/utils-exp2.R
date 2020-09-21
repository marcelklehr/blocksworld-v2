
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


# w_pos = c("and")
# w_neg = c("does not")
# 
# dat <- df %>% select(response) %>% distinct()
# 
# dat <- df %>% 
#   filter(str_detect(response, paste(w_pos, collapse='|')) &
#          !str_detect(response, paste(w_neg, collapse="|"))) 
#                      
