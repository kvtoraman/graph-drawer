# Web Based Graph Drawer

This is a web based graph drawer. Graph is drawn by a given JSON element. **d3** library is used (it makes make panning and zooming much easier). The graph is assumed to be a [cfg](https://en.wikipedia.org/wiki/Control_flow_graph). Our aim is to draw the graph such that:
- It has minimun number of back edges.
- It has minumum number of edge intersections.

## Getting Started

1. *cfg.js* is our main javascript file, *drawCanvas* function does the main job.
2. *retrieveCFGData()* function in *cfg.js* return the JSON as a string.
2. Graph is drown on index.html.


### Prerequisites

You need to have 

- [d3.js](https://d3js.org/)

## Authors

**Kamil Veli Toraman**:  [kvtoraman](https://github.com/kvtoraman)

## License

There is no licence for now. You can use as you please. This code tries to have a rule-based algorithm for movie scripts. If you have a better way, please inform me :)

## Acknowledgments

* This is a result of a individual study course in Kaist. 

