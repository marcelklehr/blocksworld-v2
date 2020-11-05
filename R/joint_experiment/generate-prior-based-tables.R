source("R/joint_experiment/my-utils.R")

# CREATE TABLES FOR MODEL PREDICTIONS -------------------------------------
sample_probs_independent = function(n, par, sd=0.01){
  pa = rbeta(n, par$p_a.shape1, par$p_a.shape2)
  pc = rbeta(n, par$p_c.shape1, par$p_c.shape2)
  upper = pmin(pa, pc)
  lower = pa + pc 
  lower[lower<=1] = 0
  lower[lower>1] = lower[lower>1]-1
  ac = rtruncnorm(n, a=lower, b=upper, mean=pa*pc, sd=sd)
  return(tibble(p_a=pa, p_c=pc, AC=ac))
}
create_independent_tables <- function(params, n=1000, sd=0.01){
  par = params %>% filter(cn == "A || C") %>%
    select(cn, id, p_a.shape1, p_a.shape2, p_c.shape1, p_c.shape2)
  tables.all = pmap_dfr(par, function(...) {
    row = tibble(...);
    probs = sample_probs_independent(n, row, sd);
    tables <- probs %>%
      mutate(`A-C`=p_a-AC, `-AC`=p_c-AC,
              s=AC+`A-C`+`-AC`, `-A-C`= case_when(s >= 1 ~ 0,
                                                 TRUE ~ 1-s));
    tables.mat = tables %>% select(-s, -p_a, -p_c)
    df.tables = prop.table(tables.mat %>% as.matrix() + epsilon, 1) %>%
      as_tibble() %>% rowid_to_column("id")
    tables_long <- df.tables %>% group_by(id) %>% 
      pivot_longer(cols=c(`AC`, `A-C`, `-AC`, `-A-C`), names_to="cell",
                   values_to="val")
    tables_wide <- tables_long %>% 
      summarise(ps = list(val), .groups = 'drop') %>%
      add_column(cn="A || C", stimulus=row$id) %>% 
      mutate(vs=list(c("AC", "A-C", "-AC", "-A-C"))) %>% dplyr::select(-id)
  });
  return(tables.all)
}

sample_probs_dependent = function(n, par, generate_by="p"){
  p_neg = rbeta(n, par$neg.shape1, par$neg.shape2)
  p_marg = rbeta(n, par$marg.shape1, par$marg.shape2)
  p_pos = rbeta(n, par$pos.shape1, par$pos.shape2)
  # if(generate_by == "p"){
  # }
  # else if(generate_by == "cp_neg") {
  #   # use causal power
  #   cp_neg = rexp(n, par$cp_neg.rate)
  #   p_pos = p_neg + cp_neg * (1-p_neg)
  # }else if(generate_by == "cp_pos"){
  #   cp_pos = rbeta(n, par$cp_pos.shape1, par$cp_pos.shape2)
  #   p_pos = p_neg + cp_pos * (1-p_neg)
  # } else {
  #   stop("generate_by must be one of cp_pos/cp_neg/p (causal power positive,
  #          causal power negative, conditional probability).");
  # }
  return(tibble(p_neg=p_neg, p_pos=p_pos, p_marg=p_marg))
}

create_dependent_tables <- function(params, n, generate_by="p"){
  cn="A implies C"
  tables.all = map_dfr(IDS.dep, function(id){
    par = params %>% filter(cn == (!! cn) & id == (!! id)) 
    probs = sample_probs_dependent(n, par);
    tables = probs %>%
      mutate(AC = p_pos * p_marg, `A-C` = (1-p_pos) * p_marg,
             `-AC` = p_neg * (1-p_marg), `-A-C` = (1-p_neg) * (1-p_marg));
    
    tables.mat = tables %>% select(-p_pos, -p_neg, -p_marg)
    df.tables = prop.table(tables.mat %>% as.matrix() + epsilon, 1) %>%
      as_tibble() %>% rowid_to_column("id")
    tables_long <- df.tables %>%
      pivot_longer(cols=c(`AC`, `A-C`, `-AC`, `-A-C`),
                   names_to="cell", values_to="val")
    tables_wide <- tables_long %>% group_by(id) %>%
      summarise(ps = list(val), .groups = 'drop') %>%
      add_column(cn=(!! cn), stimulus = (!! id)) %>%
      mutate(vs=list(c("AC", "A-C", "-AC", "-A-C"))) %>% dplyr::select(-id)
  });
  return(tables.all)
}

# Create Tables -----------------------------------------------------------
# 1.Independent
params = read_csv(
  paste(RESULT.dir, "beta-fits-by-stimulus.csv", sep=.Platform$file.sep)
) %>% group_by(id, cn)

tables.ind.nested <- create_independent_tables(params, 10000)
tables.ind = tables.ind.nested %>% rowid_to_column("bn_id") %>%
  unnest(c(vs,ps)) %>% group_by(bn_id) %>%
  mutate(ps=round(ps, 2)) %>% 
  pivot_wider(names_from="vs", values_from="ps") %>%
  ungroup() %>% select(-bn_id, -cn) %>%
  rename(id=stimulus)

tables.ind.empirical = TABLES.ind %>% select(id, AC, `A-C`, `-AC`, `-A-C`) %>%
  mutate(AC=round(AC, 2),
         `A-C`=round(`A-C`, 2),
         `-AC`=round(`-AC`, 2),
         `-A-C`=round(`-A-C`, 2))
# 2. Dependent
tables.dep.nested = create_dependent_tables(params, n=100);
tables.dep = tables.dep.nested %>% rowid_to_column("bn_id") %>%
  unnest(c(vs,ps)) %>% group_by(bn_id) %>%
  mutate(ps=round(ps, 2)) %>% 
  pivot_wider(names_from="vs", values_from="ps") %>%
  ungroup() %>% select(-bn_id, -cn) %>%
  rename(id=stimulus)

tables.dep.empirical = TABLES.dep %>% select(id, AC, `A-C`, `-AC`, `-A-C`) %>%
  mutate(AC=round(AC, 2),
         `A-C`=round(`A-C`, 2),
         `-AC`=round(`-AC`, 2),
         `-A-C`=round(`-A-C`, 2))

tables.empirical = bind_rows(tables.ind.empirical, tables.dep.empirical);
tables.model = bind_rows(tables.ind, tables.dep);

# tables that only appear in empirical, but not in model:
tables.diff = setdiff(tables.empirical %>% select(-id),
                      tables.model %>% select(-id))

# Plot Tables -------------------------------------------------------------
plot_tables <- function(tables.model, tables.empirical){
  # data must be in long format with columns *cell* and *val*
  df.model = tables.model %>% add_column(generated_by="model") %>%
    rowid_to_column() %>% pivot_longer(cols=c(AC, `A-C`, `-AC`, `-A-C`),
                                              names_to="cell", values_to="val")
  df.empirical = tables.empirical %>% add_column(generated_by="human") %>%
    rowid_to_column() %>% pivot_longer(cols=c(AC, `A-C`, `-AC`, `-A-C`),
                                              names_to="cell", values_to="val")
  p <- bind_rows(df.model, df.empirical) %>% 
    ggplot(aes(x=generated_by, y=val, color=id)) +
    geom_jitter(alpha=0.5) +
    facet_wrap(~cell, nrow = 2, ncol=2) +
    theme_classic(base_size = 20) +
    theme(legend.position = "bottom")
  return(p)
}

stimulus = "independent_hl"
plot_tables(tables.model %>% filter(id==stimulus),
            tables.empirical %>% filter(id==stimulus))





# others ------------------------------------------------------------------



create_tables = function(n=1000, roundTo=2){
  params = read_csv(
    paste(RESULT.dir, "beta-fits-by-stimulus.csv", sep=.Platform$file.sep)
  ) %>% group_by(id, cn)
  
  tables_ind <- create_independent_tables(params, n*4)
  # tables_ind <- tibble();
  tables_dep <- create_dependent_tables(params, n, generate_by = "p")
  tables_dep2 <- create_dependent_tables(params, n/2, generate_by = "cp_pos")
  tables_dep3 <- create_dependent_tables(params, n/2, generate_by = "cp_neg")
  
  tables <- bind_rows(tables_ind, tables_dep, tables_dep2, tables_dep3) %>%
    rowid_to_column("table_id")
  tables <- tables %>% unnest(c(vs, ps)) %>%
    group_by(table_id) %>% pivot_wider(names_from="vs", values_from="ps") %>% 
    # likelihood(params$indep_sigma) %>% 
    mutate(vs=list(c("AC", "A-C", "-AC", "-A-C")),
           ps=list(c(`AC`, `A-C`, `-AC`, `-A-C`))) %>%
    select(-`AC`, -`A-C`, -`-AC`, -`-A-C`)
  save_to = paste(RESULT.dir, "tables.rds", sep=SEP)
  saveRDS(tables, save_to);
  print(paste('saved tables to:', save_to))
  return(tables)
}

tables.model.nested = readRDS("/home/britta/UNI/Osnabrueck/blocksworld-v2/data/prolific/results/experiment-wor(l)ds-of-toy-blocks/tables.rds");

tables.model = tables.model.nested %>%  unnest(c(vs, ps)) %>%
  pivot_wider(names_from=vs, values_from=ps) %>%
  add_column(prolific_id=0)

tables.empirical = TABLES %>% select(-starts_with("p_"), -starts_with("theta_")) %>%
  rename(stimulus=id) %>%
  mutate(AC=round(AC, 2),
         `A-C`=round(`A-C`, 2),
         `-AC`=round(`-AC`, 2),
         `-A-C`=round(`-A-C`, 2))


df.empirical = tables.empirical %>% select(-prolific_id)
df.model = tables.model %>% ungroup() %>% select(-table_id, -prolific_id, -cn)

# tables that only appear in empirical, but not in model:
tables.diff = setdiff(df.empirical, df.model)
tables.in = setdiff(df.empirical, tables.diff) 

tables.in %>% group_by(stimulus) %>% tally() %>% arrange(desc(n))
