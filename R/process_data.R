library(here)
library(tidyverse)
source("R/utils.R")

# data_dir <- here("data", "test-runs")
data_dir <- here("data", "prolific")
data_fn <- "results_14_blocksworld-conditionals_BG.csv"

result_dir <- paste(data_dir, "results", "experiment1", sep=.Platform$file.sep)
dir.create(result_dir, recursive=TRUE)

# Anonymize and save raw ------------------------------------------------------
dat.anonym <- anonymize_and_save(data_dir, data_fn, result_dir, "exp1", test_run = FALSE)
dat.tidy <- tidy_data(dat.anonym)
dat.all <- list(train=dat.tidy$train, info=dat.tidy$info, comments=dat.tidy$comments)
                # pretest=tidy_data.pretest, color=tidy_data.color_vision)

# Process test data -----------------------------------------------------------
data <- dat.tidy$test
# filter
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

# normalize such that slider responses sum up to 1 but also keep original response 
df <- df %>% group_by(prolific_id, id) %>% 
  mutate(n=sum(response), r_norm=response/n) %>% 
  rename(r_orig=response)

# save processed data -----------------------------------------------------
path_target <- paste(result_dir, "exp1_tidy.rds", sep=.Platform$file.sep) 
print(paste('written processed anonymized tidy data to:', path_target))
dat.all$test <- df
saveRDS(dat.all, path_target)

# Also save just Table means of normalized values as csv files
means <- df %>% group_by(id, question) %>% summarise(mean=mean(r_norm))

write.table(means %>% pivot_wider(names_from = question, values_from = mean),
            file=paste(result_dir, "exp1_tables_mean.csv", sep=.Platform$file.sep),
            sep = ",", row.names=FALSE)

# All Tables (with normalized values)
tables.all <- df %>% select(id, question, prolific_id, r_norm) %>%
  group_by(id, question, prolific_id) %>%
  pivot_wider(names_from = question, values_from = r_norm)

write.table(tables.all, file=paste(result_dir, "exp1_tables_all.csv", sep=.Platform$file.sep),
            sep = ",", row.names=FALSE)
