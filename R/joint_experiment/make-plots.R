source("R/joint_experiment/analysis-utils.R")

df.wide = TABLES.dep %>% 
  # filter(prolific_id %in% pids.false_colors) %>%
  group_by(prolific_id, id) %>%
  rename(bg=AC, b=`A-C`, g=`-AC`, none=`-A-C`) %>%
  select(bg, b, g, none, prolific_id, id) %>%
  rowid_to_column()
df.long = df.wide %>% 
  pivot_longer(cols=c(bg, b, g, none), names_to="question", values_to="response") 
save_to = paste(PLOT.dir, "slider-ratings-densities", sep=SEP)
if(!dir.exists(save_to)) {dir.create(save_to)}
df.long %>%
  plotSliderDensities(questions.test, labels.test, target_dir=save_to)

save_to = paste(PLOT.dir, "slider-ratings-boxplots", sep=SEP)
if(!dir.exists(save_to)) {dir.create(save_to)}
df.long %>% plotSliderRatings(questions.test, labels.test, cluster_by="bg",
                              relation=FALSE, target_dir=save_to)


# Slider Ratings ----------------------------------------------------------
# 1.unnormalized slider ratings with utterance and normalized ratings
save_to = paste(PLOT.dir, "slider-ratings-tables", sep=SEP)
if(!dir.exists(save_to)) {dir.create(save_to)}
pids = data.joint.orig %>% pull(prolific_id) %>% unique()
stimuli =  data.prior.orig %>% pull(id) %>% unique()

getData =function(normalized=TRUE){
  if(normalized){
    df=data.joint
  } else {
    df = data.joint.orig
  }
  df = df %>%
    mutate(question = case_when(utterance==standardized.sentences$bg ~ "bg",
                                utterance==standardized.sentences$b ~ "b",
                                utterance==standardized.sentences$g ~ "g",
                                utterance==standardized.sentences$none ~ "none", 
                                TRUE ~ utterance)) %>%
    filter((question %in% questions.test) |
             !is.na(human_exp2))
  return(df)
}
df.norm = getData()
df.orig = getData(normalized=FALSE)

for(pid in pids) {
  df.pid.orig = df.orig %>% filter(prolific_id == (!! pid))
  df.pid.norm = df.norm %>% filter(prolific_id == (!! pid))
  
  target_folder = paste(save_to, pid, sep=SEP) 
  if(!exists(target_folder)){
    dir.create(target_folder)
  }
  for(stimulus in stimuli) {
    df.stim.orig = df.pid.orig %>%
      filter(id==stimulus & question %in% questions.test) %>%
      rename(means=human_exp1)
    if(df.stim.orig %>% nrow() != 0){
      df.stim.norm = df.pid.norm %>% filter(id==stimulus) %>% rename(normalized=human_exp1)
      uttered = df.stim.norm %>% filter(!is.na(human_exp2)) %>% pull(utterance)
      
      stim_utt = paste(stimulus, uttered, sep=": ") 
      df.stim = left_join(df.stim.orig %>% select(-human_exp2),
                          df.stim.norm %>% filter(question %in% questions.test),
                          by=c("prolific_id", "id", "question"))
      p = df.stim %>% PlotMeans(stimulus, sd_error_bars = FALSE) + 
        labs(y="unnormalized slider rating", x="",title=stim_utt) +
        geom_point(aes(y=normalized), size=2, color='orange') +
        theme(axis.text.x=element_blank(), legend.position="none")
      ggsave(paste(save_to, SEP, pid, SEP, stimulus, ".png", sep=""), p, width=12)
    }
  }
}

# 2.normalized ratings with produced utterance
fn = paste(PLOT.dir, "by-participants-normalized-ratings-with-production", sep=SEP)
if(!dir.exists(fn)){dir.create(fn)}
plotSliderRatingsAndUtts(data.joint, fn)


# Literal meaning probabilities -------------------------------------------
df = left_join(data.prior.norm %>% select(-question, -RT) %>% rename(human_exp1=response),
               data.production %>% select(-RT) %>% rename(utterance=response),
               by=c("id", "prolific_id", "utterance")) %>%
  filter(!is.na(human_exp2)) %>% group_by(id) %>% 
  mutate(human_exp1=case_when(str_detect(utterance, "might") & human_exp1>0.1 ~ 1,
                              TRUE ~ human_exp1))
p <- df %>%
  ggplot(aes(y=utterance, x=human_exp1)) +
  geom_point(aes(color=id)) +
  geom_vline(aes(xintercept=0.7), color="black", linetype='dashed') +
  theme_bw(base_size = 20) +
  theme(text = element_text(size=20), legend.position="bottom") +
  labs(x="rated probability (prior elicitation)", y="response")

ggsave(paste(PLOT.dir, "prior-vs-utt.png", sep=SEP), p, width=15)

#Same plot, here results plotted separately for each participant. Stimuli are color coded.
p <- df %>%
  ggplot(aes(y=utterance, x=human_exp1)) +
  geom_point(aes(color=id)) +
  geom_vline(aes(xintercept=0.7), color="black", linetype='dashed') +
  facet_wrap(~prolific_id) +
  theme_bw(base_size = 14) +
  theme(legend.position="none") +
  labs(x="rated probability (prior elicitation)", y="response")
ggsave(paste(PLOT.dir, "prior-vs-utt-per-proband.png", sep=SEP), p, width=15, height=18)


# Data Quality ------------------------------------------------------------
p = data.quality  %>%
  ggplot(aes(x=stimulus_id,  y=sum_sq_diff)) +
  geom_boxplot(aes(colour=stimulus_id), outlier.shape=NA) +
  geom_jitter(height=0, width=0.05, alpha=0.4, size=1.5) +
  theme_bw(base_size = 20) +
  theme(axis.text.x=element_text(angle=90, vjust=0.5), legend.position="none")
ggsave(paste(PLOT.dir, "quality-sum-sq-diff-to-mean.png", sep=SEP), p, width=15, height=10)

