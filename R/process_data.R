library(here)
library(tidyverse)
source("R/utils.R")

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

# Processing --------------------------------------------------------------
data_dir = ifelse(debug_run,  here("data", "test-runs"), here("data", "prolific"));
result_dir <- paste(data_dir, "results", result_fn, sep=.Platform$file.sep)
if(!dir.exists(result_dir)){
  dir.create(result_dir, recursive=TRUE);
}

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
