library(here)
library(dplyr)
library(ggplot2)
library(tidyverse)
library(here)
library(reticulate)
library(scales)
library(truncnorm)
use_condaenv("anaconda3/py36")
library(greta)
source("R/utils.R")
source("R/utils-exp1.R")


IDS.dep=c("if1_uh", "if1_u-Lh", "if1_hh", "if1_lh",
          "if2_ul", "if2_u-Ll", "if2_hl", "if2_ll");
IDS.ind = c("independent_ll", "independent_hh", "independent_hl",
            "independent_ul", "independent_uh"); #, "ind2");
IDS = c(IDS.dep, IDS.ind)

CNS = c("A implies C", "A || C");
ID_CNS = rbind(expand.grid(id=IDS.ind, cn=c("A || C")),
               expand.grid(id=IDS.dep, cn=c("A implies C")));

RESULT.dir = here("data", "prolific", "results", "experiment-wor(l)ds-of-toy-blocks")
PLOT.dir = here("data", "prolific", "results", "experiment-wor(l)ds-of-toy-blocks", "plots")

epsilon = 0.00001

SEP = .Platform$file.sep
TABLES.ind = readRDS(paste(RESULT.dir, "empiric-ind-tables-smooth.rds",
                           sep=.Platform$file.sep)) %>% filter(id != "ind2")
TABLES.dep = readRDS(paste(RESULT.dir, "empiric-dep-tables-smooth.rds",
                           sep=.Platform$file.sep))
