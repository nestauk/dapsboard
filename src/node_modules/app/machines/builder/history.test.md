# URL sequences for testing history managemnt

1.
  - /
  - /builder
  - /builder?q=(dataset:mosaic_nih_v7,form:primary,forms:!((name:primary,params:(interval:4),selection:(aggregation:histogram,field:year_fiscal_funding,type:integer)),(name:secondary)),size:0)
  - BACK: 
  - /builder

2.
  - /builder
  - /builder?q=(dataset:mosaic_nih_v5,form:primary,forms:!((name:primary,selection:(aggregation:histogram,type:integer))),size:0)
  - BACK:
  - /builder
  - FWD:
  - /builder?q=(dataset:mosaic_nih_v5,form:primary,forms:!((name:primary,selection:(aggregation:histogram,type:integer))),size:0)
  - Click on a field:
  - /builder?q=(dataset:mosaic_nih_v5,form:primary,forms:!((name:primary,selection:(aggregation:histogram,field:year_fiscal_funding,type:integer)),(name:secondary)),size:0)
  - BACK:
  - /builder

3.
  - /builder?q=(dataset:mosaic_nih_v7,form:primary,forms:!((name:primary,selection:(aggregation:histogram,field:year_fiscal_funding,type:integer)),(name:secondary)),size:0)
  - /builder?q=(dataset:mosaic_nih_v7,form:primary,forms:!((name:primary,selection:(aggregation:reverse_nested,field:year_fiscal_funding,type:integer)),(name:secondary)),size:0)
  - /builder?q=(dataset:mosaic_nih_v5,form:primary,forms:!((name:primary,selection:(aggregation:reverse_nested,field:year_fiscal_funding,type:integer)),(name:secondary)),size:0)
  - /builder?q=(dataset:mosaic_nih_v5,form:primary,forms:!((name:primary,selection:(aggregation:reverse_nested,field:cost_total_project,type:integer)),(name:secondary)),size:0)

4.
  - /builder
  - /builder?q=(dataset:mosaic_nih_v7,form:primary,forms:!((name:primary,selection:(aggregation:extended_stats,field:cost_total_project))),size:0)
  - Select second axis
  - Select first axis
  - Select second axis
  - Select first axis
  - Select second axis
  - BACK: /builder?q=(dataset:mosaic_nih_v7,form:primary,forms:!((name:primary,selection:(aggregation:extended_stats,field:cost_total_project))),size:0)
  - BACK: /builder