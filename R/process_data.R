library(here)
library(tidyverse)
source("R/utils.R")

N_trials <- list(train=15, test=14, color_vision=0);

# Experiment 1 ------------------------------------------------------------
# data_dir <- here("data", "test-runs")
data_dir <- here("data", "prolific")
data_fn <- "results_15_WorldOfToyBlocks-Pilot_BG.csv"

result_dir <- paste(data_dir, "results", "experiment1-v2", sep=.Platform$file.sep)
dir.create(result_dir, recursive=TRUE);
debug_run <- FALSE # vs. experimental (prolific) run
result_fn <- "exp1"
test_trial_name <- "multiple_slider"

dat.exp1 <- process_data(data_dir, data_fn, result_dir, result_fn, debug_run,
                         N_trials, test_trial_name);


# Experiment 2 ------------------------------------------------------------
N_trials$color_vision <- 4
# data_dir <- here("data", "test-runs")
data_dir <- here("data", "prolific")
data_fn <- "results_17_WordsOfToyBlocks-Pilot_BG.csv"

result_dir <- paste(data_dir, "results", "experiment2", sep=.Platform$file.sep)
dir.create(result_dir, recursive=TRUE);
debug_run <- FALSE # vs. experimental (prolific) run
result_fn <- "exp2"
test_trial_name <- "fridge_view"

dat.exp2 <- process_data(data_dir, data_fn, result_dir, result_fn, debug_run,
                         N_trials, test_trial_name);



# # Anonymize and save raw ------------------------------------------------------
# dat.anonym <- anonymize_and_save(data_dir, data_fn, result_dir, result_fn, test_run)
# dat.tidy <- tidy_data(dat.anonym)
# dat.all <- list(train=dat.tidy$train, info=dat.tidy$info, comments=dat.tidy$comments)
#                 # pretest=tidy_data.pretest, color=tidy_data.color_vision)
# 
# # Process test data -----------------------------------------------------------
# data <- dat.tidy$test
# # filter
# # 1. Reaction time
# filtered_rt_small <- data %>% filter(RT < 4 * 1000)
# filtered_rt_large <- data %>% filter(RT > 3 * 60  * 1000)
# 
# #TODO: uncomment filtering again!
# # df <- data %>% filter(RT >= 4000 & RT <= 3 * 60 * 1000)
# df <- data
# print(paste('filtered due to too long RT:', nrow(filtered_rt_large)))
# print(paste('filtered due to too small RT:', nrow(filtered_rt_small)))
# 
# 
# # 2. Comments
# 
# # 3. All 0 or all 1 responses
# # One can't believe that all events will certainly (not) happen
# filtered_sum <- df %>%
#   group_by(prolific_id, id) %>%
#   filter(sum(response) == 0 | sum(response) == 4)
# 
# df <- df %>% filter(sum(response) != 0 & sum(response) != 4)
# print(paste('filtered due to sum=4 or sum=0:', nrow(filtered_sum)))
# 
# 
# # standardize colour groups -----------------------------------------------
# df <- standardize_color_groups(df)
# 
# # normalize such that slider responses sum up to 1 but also keep original response
# df <- df %>% group_by(prolific_id, id) %>%
#   mutate(n=sum(response), r_norm=response/n) %>%
#   rename(r_orig=response)
# 
# # save processed data -----------------------------------------------------
# fn_tidy <- paste(result_fn, "_tidy.rds", sep="");
# path_target <- paste(result_dir, fn_tidy, sep=.Platform$file.sep)
# print(paste('written processed anonymized tidy data to:', path_target))
# dat.all$test <- df
# saveRDS(dat.all, path_target)
# 
# # Also save just Table means of normalized values as csv files
# means <- df %>% group_by(id, question) %>% summarise(mean=mean(r_norm))
# 
# fn_table_means <- paste(result_fn, "_tables_mean.csv", sep="");
# write.table(means %>% pivot_wider(names_from = question, values_from = mean),
#             file=paste(result_dir, fn_table_means, sep=.Platform$file.sep),
#             sep = ",", row.names=FALSE)
# 
# # All Tables (with normalized values)
# tables.all <- df %>% select(id, question, prolific_id, r_norm) %>%
#   group_by(id, question, prolific_id) %>%
#   pivot_wider(names_from = question, values_from = r_norm)
# 
# fn_tables_all <- paste(result_fn, "_tables_all.csv", sep="");
# write.table(tables.all, file=paste(result_dir, fn_tables_all, sep=.Platform$file.sep),
#             sep = ",", row.names=FALSE)
