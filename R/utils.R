library(tidyverse)

test_data <- function(path_to_csv) {
  data <- read_csv(path_to_csv) %>%
    mutate(prolific_id = str_trim(str_to_lower(prolific_id))) %>% 
    filter(str_detect(prolific_id, "test-.*") | str_detect(prolific_id, "test "))
  return(data)
}

experimental_data <- function(path_to_csv){
  data <- read_csv(path_to_csv) %>%
    mutate(prolific_id = str_trim(str_to_lower(prolific_id))) %>% 
    filter(!str_detect(prolific_id, "test.*") & prolific_id != "" &
           !is.na(prolific_id))
  return(data)
}

anonymize_and_save <- function(data_dir, data_fn, result_dir, result_fn, test_run=FALSE){
  path_to_data <- paste(data_dir, data_fn, sep=.Platform$file.sep)
  data <- if(test_run) test_data(path_to_data) else experimental_data(path_to_data)
    
  if(!test_run) {
    # filter test debug trials
    prolific_ids <- data %>% pull(prolific_id) %>% unique()
    new_ids <- paste("participant", seq(1,  length(prolific_ids)), sep="")
    n_trials <- data %>% group_by(prolific_id) %>% summarize(n=n()) %>% pull(n) %>%
      unique()
    data <- data %>% mutate(prolific_id = rep(new_ids, each = n_trials))
  }
  path_target <- paste(result_dir, paste(result_fn, "raw.csv", sep="_"), sep = .Platform$file.sep)
  write_excel_csv(data, path = path_target, delim = ",", append = FALSE, col_names=TRUE)
  print(paste('written anonymized version to:', path_target))
  return(data)
}

tidy_test <- function(df){
  dat.test <- df %>% filter(trial_name == "multiple_slider") %>% 
    select(prolific_id, RT, QUD, id, group, noticed_steepness,
           icon1, icon2, icon3, icon4,
           response1, response2, response3, response4) %>% 
    pivot_longer(cols=c(contains("response")),
                 names_to = "response_idx", names_prefix = "response", 
                 values_to = "response") %>% 
    pivot_longer(cols=c(contains("icon")),
                 names_to = "icon_idx", names_prefix = "icon",
                 values_to = "icon") %>% 
    filter(response_idx == icon_idx) %>% 
    select(-response_idx, -icon_idx) %>%
    rename(question=icon)
  
  dat.test <- dat.test %>%
    mutate(response = as.numeric(response),
           response = response/100, 
           prolific_id = factor(prolific_id),
           id = factor(id))
  return(dat.test)
}

tidy_train <- function(df){
  dat.train <- df %>% filter(startsWith(trial_name, "animation")) %>% 
    select(prolific_id, RT, expected, QUD, id, trial_name,
           icon1, icon2, icon3, icon4,
           response1, response2, response3, response4,
    ) %>% 
    pivot_longer(cols=c(contains("icon")),
                 names_to = "icon_idx", names_prefix = "icon",
                 values_to = "icon") %>% 
    pivot_longer(cols=c(contains("response")),
                 names_to = "response_idx", names_prefix = "response", 
                 values_to = "response") %>% 
    filter(response_idx == icon_idx) %>% 
    select(-response_idx) %>% 
    mutate(prolific_id = factor(prolific_id),
           id = factor(id))
  return(dat.train)
}

tidy_pretest <- function(df){
  dat.pre <- df %>% filter(trial_name == "pretest") %>% 
    select(prolific_id, question, response, id, trial_name, trial_number) %>% 
    mutate(prolific_id = factor(prolific_id), id=factor(id), 
           response = as.numeric(response),
           trial_number = as.character(trial_number))
  return(dat.pre)
}

tidy_and_save_data <- function(data, result_dir, fn, test_run, N_test=20, N_train=11){
  # 1. Select only columns relevant for data analysis
  df <- data %>% select(prolific_id,
                        question, question1, question2, question3, question4,
                        QUD, icon1, icon2, icon3, icon4, response, 
                        expected, response1, response2, response3, response4,
                        id, trial_name, trial_number, group, 
                        timeSpent, RT,
                        noticed_steepness,
                        education, comments, gender, age) 
  N_participants <- df %>% select(prolific_id) %>% unique() %>% nrow()
  stopifnot(nrow(df) == N_participants * (N_test + N_train));

  dat.comments <- df %>%
    select(prolific_id, noticed_steepness, comments) %>% 
    mutate(comments = if_else(is.na(comments), "", comments)) %>% 
    unique()
  dat.info <- df %>% select(prolific_id, education, gender, age, timeSpent) %>%
    unique()
  # dat.color_vision <- df %>% 
  #   filter(trial_name == "color-vision") %>% 
  #   select(prolific_id, id, question, response, expected, picture1, picture2, QUD)

  dat.train <- tidy_train(df)
  dat.test <- tidy_test(df)
  dat.pretest <- tidy_pretest(df)

  dat.all <- list(test=dat.test, train=dat.train, 
                  # color=dat.color_vision,
                  info=dat.info, comments=dat.comments, pretest=dat.pretest)
  
  path_target <- paste(result_dir, paste(fn, "_tidy.rds", sep=""), sep=.Platform$file.sep) 
  print(paste('written tidied anonymized data to:', path_target))
  saveRDS(dat.all, path_target)
  return(dat.all)
}

standardize_color_groups <- function(df){
  df <- df %>%
    # mutate(question = case_when(question == "none" ~ "none",
    #                             (question == "bg" | question == "gb") ~ "ac",
    #                             (question == "b" & group == "group2") ~ "c",
    #                             (question == "g" & group == "group2") ~ "a",
    #                             TRUE ~ question)) %>% 
    # mutate(question = case_when((question == "b" & group == "group1") ~ "a", 
    #                             (question == "g" & group == "group1") ~ "c", 
    #                             TRUE ~ question),
    mutate(question = case_when((question == "bg" | question == "gb") ~ "ac",
                                 question == "none" ~ "none",
                                 group == "group1" & question == "b" ~ "a",
                                 group == "group1" & question == "g" ~ "c",
                                 group == "group2" & question == "b" ~ "a",
                                 group == "group2" & question == "g" ~ "c",
                                 TRUE ~ "IMPOSSIBLE"
                                ),
           group = "group1")
  return(df)
}


# @arg df: data frame containing columns ac, a
add_probs <- function(df, keys){
  df <- df %>% mutate(p_a=ac+a, p_c=ac+c, p_na=1-p_a, p_nc=1-p_c) %>%
    mutate(p_c_given_a = if_else(p_a==0, 0, ac / p_a),
           p_c_given_na = if_else(p_na==0, 0, c / p_na),
           p_a_given_c = if_else(p_c==0, 0, ac / p_c),
           p_a_given_nc = if_else(p_nc==0, 0, a / p_nc),
           p_nc_given_a = 1 - p_c_given_a,
           p_nc_given_na = 1 - p_c_given_na,
           p_na_given_c = 1 - p_a_given_c,
           p_na_given_nc = 1 - p_a_given_nc,
           p_likely_a = p_a,
           p_likely_na=p_na,
           p_likely_c = p_c,
           p_likely_nc=p_nc
    ) 
  return(df)
}

filter_noticed_steepness <- function(df){
  df$noticed_steepness %>% unique()
  df <- df %>% mutate(noticed_steepness = str_to_lower(noticed_steepness))
  return(df %>% filter(str_detect(noticed_steepness, "yes")))
}

# prepare_tables <- function(tables, N_test = 25){
#   tables_wide <- tables %>%
#     group_by(stimulus_id, participant_id) %>%
#     pivot_wider(names_from = utterance, values_from = response) %>%
#     mutate(none=sprintf("%3f", none), ac=sprintf("%3f", ac),
#            a=sprintf("%3f", a), c=sprintf("%3f", c)) %>% 
#     select(-n) %>% 
#     mutate(none=floor(as.numeric(none)*1000)/1000,
#            ac=floor(as.numeric(ac) * 1000)/1000,
#            a=floor(as.numeric(a)*1000)/1000,
#            c=floor(as.numeric(c)*1000)/1000) %>% 
#     distinct()
#   
#   tables_to_wppl <- tables_wide %>%
#     add_column(vs=list(c("AC", "A-C", "-AC", "-A-C"))) %>%
#     group_by(stimulus_id, participant_id) %>%
#     mutate(ps=list(c(ac, a, c, none))) %>% 
#     ungroup() %>%
#     select(participant_id, stimulus_id, ps, vs)
#   
#   return(tables_to_wppl)
# }


# # TODO: remove response/utterances/RT into useful string
# # then separate into different cols
# df <- df %>% mutate(response = str_replace_all(response, "\\|", "-"))
# df <- df %>%
#   separate(response, into=c("response1", "response2", "response3",
#                             "response4"), sep="-")

