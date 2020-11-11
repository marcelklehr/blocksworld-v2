source("R/joint_experiment/my-utils.R")

# CREATE TABLES FOR MODEL PREDICTIONS -------------------------------------
sample_probs_independent = function(n, par, sd=0.01){
  pa = rbeta(n, par$p_a1, par$p_a2)
  pc = rbeta(n, par$p_c1, par$p_c2)
  upper = pmin(pa, pc)
  lower = pa + pc 
  lower[lower<=1] = 0
  lower[lower>1] = lower[lower>1]-1
  ac = rtruncnorm(n, a=lower, b=upper, mean=pa*pc, sd=sd)
  return(tibble(p_a=pa, p_c=pc, AC=ac))
}
create_independent_tables <- function(params, n=1000, sd=0.01){
  par.ind = params %>% filter(cn == "A || C")
  tables.all = pmap_dfr(par.ind, function(...) {
    row = tibble(...)
    print(paste(row$cn, row$id))
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
    tables_long %>%
      summarise(ps = list(val), vs=list(cell), .groups = 'drop') %>%
      add_column(cn="A || C", stimulus=row$id) %>%
      dplyr::select(-id) %>% rename(stimulus_id=stimulus)
  });
  return(tables.all)
}

sample_probs_dependent = function(n, par){
  p_neg = rbeta(n, par$neg1, par$neg2)
  p_marg = rbeta(n, par$marg1, par$marg2)
  p_pos = rbeta(n, par$pos1, par$pos2)
  return(tibble(p_neg=p_neg, p_pos=p_pos, p_marg=p_marg))
}

create_dependent_tables <- function(params, n, generate_by="p"){
  cn="A implies C"
  par.dep = params %>% filter(cn == (!! cn)) 
  tables.all = pmap_dfr(par.dep, function(...){
    row = tibble(...)
    print(paste(row$cn, row$id))
    probs = sample_probs_dependent(n, row);
    tables = probs %>%
      mutate(AC = p_pos * p_marg, `A-C` = (1-p_pos) * p_marg,
             `-AC` = p_neg * (1-p_marg), `-A-C` = (1-p_neg) * (1-p_marg));
    
    tables.mat = tables %>% select(-p_pos, -p_neg, -p_marg)
    df.tables = prop.table(tables.mat %>% as.matrix() + epsilon, 1) %>%
      as_tibble() %>% rowid_to_column("id")
    tables_long <- df.tables %>%
      pivot_longer(cols=c(`AC`, `A-C`, `-AC`, `-A-C`),
                   names_to="cell", values_to="val")
    tables_long %>% group_by(id) %>%
      summarise(ps = list(val), vs=list(cell), .groups = 'drop') %>%
      add_column(cn=(!! row$cn), stimulus = (!! row$id)) %>%
      select(-id) %>% rename(stimulus_id=stimulus) 
  });
  return(tables.all)
}

# Create Tables -----------------------------------------------------------
create_tables = function(target_dir, n=2500){
  params = read_csv(
    paste(RESULT.dir, "beta-fits.csv", sep=SEP)
  ) %>% group_by(id, cn)
  
  tables_ind <- create_independent_tables(params, n*4)
  tables_dep <- create_dependent_tables(params, n, generate_by = "p")
  df.tables <- bind_rows(tables_ind, tables_dep) %>%
    rowid_to_column("id")
  tables <- df.tables %>% unnest(c(vs, ps)) %>%
    group_by(id) %>% pivot_wider(names_from="vs", values_from="ps") %>%
    mutate(p_a=AC+`A-C`, p_c=AC+`-AC`, p_c_given_a=AC/p_a, p_c_given_na=`A-C`/(1-p_a))
  
  stimuli = tables$stimulus_id %>% unique()
  tables.ll=map_dfr(stimuli, function(id){
    print(id)
    cn = ifelse(str_detect(id, "independent"), "A || C", "A implies C")
    par = params %>% filter(id == (!! id))
    ll = tables %>% log_likelihood(cn, par)
    ll %>% mutate(ll.key= (!!id))
  })
  tables.ll = tables.ll %>% select(-starts_with("p_"), -lb, -ub) %>%
    filter(!is.na(AC) && !is.na(`A-C`) && !is.na(`-AC`) && !is.na(`-A-C`)) %>%
    group_by(id, ll.key) %>% 
    mutate(vs=list(c("AC", "A-C", "-AC", "-A-C")),
           ps=list(c(`AC`, `A-C`, `-AC`, `-A-C`))) %>%
    select(-`AC`, -`A-C`, -`-AC`, -`-A-C`)
  return(tables.ll)
}

formatGeneratedTables4Webppl = function(generated_tables) {
  # 1.Independent
  tables.ind = generated_tables %>% filter(cn=="A || C") %>% rowid_to_column("bn_id") %>%
    unnest(c(vs,ps)) %>% group_by(bn_id) %>%
    mutate(ps=round(ps, 2)) %>% 
    pivot_wider(names_from="vs", values_from="ps") %>%
    ungroup() %>% select(-bn_id)
  
  tables.ind.empirical = TABLES.ind %>%
    select(id, prolific_id, AC, `A-C`, `-AC`, `-A-C`) %>%
    mutate(AC=round(AC, 2),
           `A-C`=round(`A-C`, 2),
           `-AC`=round(`-AC`, 2),
           `-A-C`=round(`-A-C`, 2))
  # 2. Dependent
  tables.dep = generated_tables %>% filter(cn!="A || C") %>% rowid_to_column("bn_id") %>%
    unnest(c(vs,ps)) %>% group_by(bn_id) %>%
    mutate(ps=round(ps, 2)) %>% 
    pivot_wider(names_from="vs", values_from="ps") %>%
    ungroup() %>% select(-bn_id)
  
  tables.dep.empirical = TABLES.dep %>%
    select(id, prolific_id, AC, `A-C`, `-AC`, `-A-C`) %>%
    mutate(AC=round(AC, 2),
           `A-C`=round(`A-C`, 2),
           `-AC`=round(`-AC`, 2),
           `-A-C`=round(`-A-C`, 2))
  
  tables.empirical = bind_rows(tables.ind.empirical, tables.dep.empirical) %>%
    rename(stimulus_id=id)
  tables.model = bind_rows(tables.ind, tables.dep) 
  
  tables.eq.with_id = intersect(tables.empirical %>% select(-prolific_id),
                                tables.model %>% select(-ll, -ll.key, -id, -cn)); 
  tables.eq.without_id = intersect(
    tables.empirical %>% select(-stimulus_id, -prolific_id),
    tables.model %>% select(-stimulus_id, -ll, -ll.key, -id, -cn)
  ); 
  print(paste('nb. of generated empirical tables (dependent on id):', nrow(tables.eq.with_id)))
  print(paste('nb. of generated empirical tables (across ids):', nrow(tables.eq.without_id)))
  
  generated.empirical = left_join(
    tables.eq.without_id,
    tables.model, by=c("AC", "A-C", "-AC", "-A-C")
  ) %>% group_by(AC, `A-C`, `-AC`, `-A-C`) %>%
    add_column(empirical=TRUE);
  
  generated.not_empirical = setdiff(
    tables.model, generated.empirical %>% select(-empirical)
  ) %>% add_column(empirical=FALSE)
  
  tables.toWPPL = bind_rows(generated.empirical, generated.not_empirical) %>%
    mutate(orig_stimulus=stimulus_id) %>% 
    unite("stimulus_id", stimulus_id, id, sep="--") %>%
    group_by(stimulus_id)
  
  df1 = tables.toWPPL %>% filter(str_detect(ll.key, "independent")) %>% 
    mutate(ll.key=ll.key[ll==max(ll)], ll=max(ll)) %>%
    distinct()
  df2 = tables.toWPPL %>% filter(!str_detect(ll.key, "independent")) %>% 
    mutate(ll.key=ll.key[ll==max(ll)], ll=max(ll)) %>%
    distinct()
  df=bind_rows(df1, df2) %>%
    mutate(ll.key = case_when(startsWith(ll.key, "independent") ~ "logL_ind",
                              TRUE ~ "logL_if_ac")) %>%
    group_by(stimulus_id, ll.key) %>% arrange(desc(ll)) %>% 
    distinct()
  
  tables.toWPPL = df %>% group_by(stimulus_id) %>% 
    pivot_wider(names_from=ll.key, values_from=ll) %>% 
    mutate(vs=list(c("AC", "A-C", "-AC", "-A-C")),
           ps=list(c(`AC`, `A-C`, `-AC`, `-A-C`))) %>%
    select(-AC, -`A-C`, -`-AC`, -`-A-C`)
  save_to = paste(target_dir, "model-tables-stimuli.rds", sep=SEP)
  saveRDS(tables.toWPPL, save_to);
  print(paste('saved generated tables to:', save_to))
  
  save_to = "tables-empirical-all.rds"
  saveRDS(tables.empirical, save_to)
  print(paste('saved empirical tables to:', save_to))
  
  return (tables.toWPPL)
}

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

target_dir = "../MA-project/conditionals/data";
tables.nested = create_tables(target_dir, 2500)
tables = formatGeneratedTables4Webppl(tables.nested)


# stimulus = "independent_hl"
# plot_tables(tables.model %>% filter(id==stimulus),
#             tables.empirical %>% filter(id==stimulus))


