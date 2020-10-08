library(here)
library(tidyverse)
source("R/utils.R")

# setup -------------------------------------------------------------------
debug_run <- TRUE # debug vs. experimental (prolific) run
# -------------------------------------------------------------------------

N_trials <- list(train=16, test=18*2, color_vision=8);
# N_trials <- list(train=15, test=13, color_vision=6);
anonymize <- FALSE

# Experiment data ------------------------------------------------------------
data_dir <- ifelse(debug_run, here("data", "test-runs"), here("data", "prolific"))
data_fn <- "results_39_wor(l)ds-of-toy-blocks-pilot_BG.csv"

result_dir <- paste(data_dir, "results", "experiment-wor(l)ds-of-toy-blocks",
                    sep=.Platform$file.sep)
dir.create(result_dir, recursive=TRUE);
result_fn <- "experiment-wor(l)ds-of-toy-blocks"
dat.exp <- process_data(data_dir, data_fn, result_dir, result_fn, debug_run, N_trials, "joint");
