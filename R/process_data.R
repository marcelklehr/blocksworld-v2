library(here)
library(tidyverse)
source("R/utils.R")
source("R/utils-exp1.R")
source("R/utils-exp2.R")

# Setup -------------------------------------------------------------------
# experiment = "prior"
# experiment="production"
experiment = "joint"

# debug_run = TRUE  # vs. experimental (prolific) run
debug_run = FALSE

# data_fn <- "results_15_WorldOfToyBlocks-Pilot_BG.csv"
# data_fn <- "results_38_Experiment-2-Fridge-Pilot_BG_20.csv"
data_fn <- "results_39_wor(l)ds-of-toy-blocks-pilot_BG.csv"

# result_fn = "experiment1-v2"
result_fn = "experiment-wor(l)ds-of-toy-blocks"
# result_fn = "experiment2"

data_dir = ifelse(debug_run,  here("data", "test-runs"), here("data", "prolific"));
result_dir <- paste(data_dir, "results", result_fn, sep=.Platform$file.sep)
if(!dir.exists(result_dir)){
  dir.create(result_dir, recursive=TRUE);
}
# Processing --------------------------------------------------------------
if(experiment == "prior"){
  N_trials <- list(train=14, test=15, color_vision=0);
} else if(experiment == "production") {
  N_trials <- list(train=15, test=18, color_vision=8);
} else if(experiment == "joint"){
  # N_trials <- list(train=14, test=19*2, color_vision=8)
  N_trials <- list(train=14, test=14*2, color_vision=6);
}
data <- process_data(data_dir, data_fn, result_dir, result_fn, debug_run,
                     N_trials, experiment)


# Filter data -------------------------------------------------------------
filter_data_by_quality = function(data, dmax=2){
  df.prior = data$test %>%
    filter(str_detect(trial_name, "multiple_slider")) %>% 
    select(-utterance, -custom_response)
  exp1.quality = df.prior %>% responsesSquaredDiff2Mean()
  
  dat.quality = exp1.quality %>%
    # mutate(quantiles=list(quantile(sum_sq_diff))) %>%
    mutate(iqr=IQR(sum_sq_diff), mean=mean(sum_sq_diff),
           outlier=sum_sq_diff < (mean-dmax*iqr) || (sum_sq_diff>mean + dmax*iqr)) %>%
    filter(!outlier) %>% mutate(max_diff_iqr=dmax) %>%
    select(prolific_id, stimulus_id)
  
  # load smoothed tables
  target.dir = here("data", "prolific", "results", "experiment-wor(l)ds-of-toy-blocks");
  tables = readRDS(paste(target.dir, "empiric-all-tables-smooth.rds", sep=.Platform$file.sep))
  df = right_join(tables, dat.quality %>% rename(id=stimulus_id))
  
  save_to = paste(target.dir, "empiric-filtered-tables-smooth.rds", sep=.Platform$file.sep)
  saveRDS(df, save_to)
  print(paste("saved filtered tables to:", save_to))
  return(df)
}
tables.quality = filter_data_by_quality(data)


# filter_test_data = function(){
#   data = readRDS(paste(result_dir, .Platform$file.sep, result_fn, "_tidy.rds", sep=""))
#   exp1.quality = readRDS(paste(result_dir, .Platform$file.sep, result_fn, "_tidy_quality.rds", sep=""))
#   
#   # experiment == "joint")
#   # 1.quality of test-responses
#   out.test_quality = exp1.quality %>%
#     filterOutLowQuality();
#   
#   # 2.color vision questions in between
#   out.color_quality = data$color %>% group_by(prolific_id, id) %>%
#     mutate(correct = expected == response) %>%
#     filter(!correct) %>% 
#     ungroup() %>% select(prolific_id);
#   message(paste("#participants excluded as at least 1 wrong color question:",
#                 nrow(out.color_quality)))
#   stimuli = exp1.quality$id %>% unique
#   out.color_quality = expand.grid(prolific_id=out.color_quality$prolific_id, id=stimuli) %>%
#     as_tibble() 
#   
#   # 3. due to comments
#   # (due to diminished motivation)
#   out.comments = expand.grid(prolific_id="5f18a8fcc413fc0c4c0f4e49", id=stimuli) %>%
#     as_tibble()
#   # out.comments = tibble()
#   
#   # filter data
#   out = bind_rows(out.color_quality, out.test_quality, out.comments) %>%
#     distinct() %>% tibble_as_list();
#   df.test = data$test %>% mutate(prolific_id=as.character(prolific_id),
#                                  id=as.character(id));
#   df.out = map_dfr(out, function(.x){
#     df.test %>% filter(prolific_id == .x$prolific_id & id == .x$id)
#   })
#   dat.good = setdiff(df.test, df.out)
#   target = paste(result_dir, .Platform$file.sep, result_fn, "_tidy_filtered.rds", sep="")
#   saveRDS(dat.good, target)
#   print(paste("saved data to:", target))
#   
#   tables.filtered = dat.good %>% 
#     filter(startsWith(trial_name, "multiple_")) %>% 
#     select(prolific_id, id, r_orig, question) %>% group_by(prolific_id, id) %>% 
#     pivot_wider(names_from="question", values_from="r_orig")
#   target.tables = paste(result_dir, .Platform$file.sep,
#                         "experiment-wor(l)ds-of-toy-blocks_tables_filtered.csv", sep="") 
#   write_csv(tables.filtered, target.tables)
#   print(paste("saved filtered test tables to:", target.tables))
#   
#   return(dat.good)
# }



