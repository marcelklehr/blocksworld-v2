library(here)
library(tidyverse)
source("R/utils.R")

# data_dir <- here("data", "test-runs")
data_dir <- here("data", "prolific")
data_fn <- "results_14_blocksworld-conditionals_BG.csv"

result_dir <- paste(data_dir, "results", "experiment1", sep=.Platform$file.sep)
dir.create(result_dir, recursive=TRUE)

# Anonymize and save ------------------------------------------------------
dat.anonym <- anonymize_and_save(data_dir, data_fn, result_dir, "exp1", test_run = FALSE)
data <- tidy_and_save_data(dat.anonym, result_dir, "exp1", test_run = FALSE)

# Filter data -------------------------------------------------------------
data <- data$test
# 1. Reaction time
filtered_rt <- data %>% filter(RT < 4 * 1000 | RT > 3 * 60  * 1000)

#TODO: uncomment filtering again!
# df <- data %>% filter(RT >= 4000 & RT <= 3 * 60 * 1000)
df <- data

print(paste('filtered due to RT:', nrow(filtered_rt)))

# 2. Comments

# 3. All 0 or all 1 responses
# One can't believe that all events will certainly (not) happen
filtered_sum <- df %>%
  group_by(prolific_id, id) %>% 
  filter(sum(response) == 0 | sum(response) == 4)

df <- df %>% filter(sum(response) != 0 & sum(response) != 4)
print(paste('filtered due to sum=4 or sum=0:', nrow(filtered_sum)))


# standardize colour groups -----------------------------------------------
df <- standardize_color_groups(df)

# normalize such that slider responses sum up to 1 ------------------------
df <- df %>% group_by(prolific_id, id) %>% 
  mutate(n=sum(response), response=response/n)

# save processed data -----------------------------------------------------
saveRDS(df, paste(result_dir, "exp1_test_trials_processed.rds", sep=.Platform$file.sep))

means <- df %>% group_by(id, question) %>% summarise(mean=mean(response))
write.table(means %>% pivot_wider(names_from = question, values_from = mean),
            file=paste(result_dir, "exp1_prob_tables_mean.csv", sep=.Platform$file.sep),
            sep = ",", row.names=FALSE)

tables.all <- df %>% select(id, question, prolific_id, response) %>%
  group_by(id, question, prolific_id) %>%
  pivot_wider(names_from = question, values_from = response)

write.table(tables.all, file=paste(result_dir, "exp1_prob_tables_all.csv",
                                   sep=.Platform$file.sep),
            sep = ",", row.names=FALSE)

