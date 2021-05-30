import React from "react";
import { Group } from "@vx/group";
// import { genBins } from "@vx/mock-data";
import { scaleLinear } from "@vx/scale";
import { HeatmapCircle, HeatmapRect } from "@vx/heatmap";
import { useTooltip, withTooltip, Tooltip, TooltipWithBounds } from "@vx/tooltip";
import { localPoint } from '@vx/event';
import { ParentSize, ScaleSVG } from "@vx/responsive";
import { encrypt, decrypt } from './lib/parser'
import Database from './lib/database'
import Nautilus from './index';

const hot1 = "#77312f";
const hot2 = "#0f0";
const cool1 = "#122549";
const cool2 = "#17B8BE";
const bg = "transparent";

// const data = genBins(64, 16);
// const data = genBins(64, 16);
const nautilusNetwork = Nautilus()
const {db} = Database.start()
db.loadDatabase()
// console.log('1.BlockchainGraph db collections : ',db.listCollections())
const secrets = db.getCollection('secrets');
secrets.flushChanges()
// console.log('2.BlockchainGraph secrets: ',secrets.count)
// const data = secrets ? secrets.findOne({}).data : nautilusNetwork.data
const data = secrets.findOne({}).data
// console.log('3.BlockchainGraph secrets data: ',data)
//
// const productService = io('//dev01-admin.nautilusly.com/product');
// var purchaseService = io.connect('//dev01-admin.nautilusly.com/purchase');
// var userService = io.connect('//dev01-admin.nautilusly.com/user');

// productService.emit('list', function(err, data) {
//     const parseData = data && data.length? JSON.stringify(data) : "{data: null}"
//     console.log('blockchainGraph - list : ',parseData)
// })

// utils
const max = (data, value = d => d) => Math.max(...data.map(value));
const min = (data, value = d => d) => Math.min(...data.map(value));

// accessors
const bins = d => d.bins;
const count = d => d.count;

const colorMax = max(data, d => max(bins(d), count));
const bucketSizeMax = max(data, d => bins(d).length);

// scales
const xScale = scaleLinear({
  domain: [0, data.length]
});
const yScale = scaleLinear({
  domain: [0, bucketSizeMax]
});
const circleColorScale = scaleLinear({
  range: [hot1, hot2],
  domain: [0, colorMax]
});
const rectColorScale = scaleLinear({
  range: [cool1, cool2],
  domain: [0, colorMax]
});
const opacityScale = scaleLinear({
  range: [0.1, 1],
  domain: [0, colorMax]
});

const BlockchainGraph = withTooltip(

    ({
        width,
        height,
        separation = 2,
        margin = {
            top: 10,
            left: 0,
            right: 0,
            bottom: 60
        },
        tooltipOpen,
        tooltipLeft,
        tooltipTop,
        tooltipData,
        hideTooltip,
        showTooltip

    }) => {

        // bounds
        let size = width;
        if (size > margin.left + margin.right) {
            size = width - margin.left - margin.right - separation;
        }

        const xMax = size;
        const yMax = height - margin.bottom - margin.top;
        const binWidth = xMax / data.length;
        const binHeight = yMax / bucketSizeMax;
        const radius = min([binWidth, binHeight]) / 2;

        xScale.range([0, xMax]);
        yScale.range([yMax, 0]);

        // const {
        //     tooltipData,
        //     tooltipLeft,
        //     tooltipTop,
        //     tooltipOpen,
        //     showTooltip,
        //     hideTooltip,
        // } = useTooltip();

        const handleMouseOver = (event, row, column, count, rest ) => {

            const coords = localPoint(event.target.ownerSVGElement, event);

            console.log('DATUM: ', rest, row, column, count);

                showTooltip({
                    tooltipLeft: coords.x,
                    tooltipTop: coords.y,
                    tooltipData: {
                        row,
                        column,
                        count,
                        rest
                    }
                });
        };

        return (

            <div className="ntls--blockchain-container" style={{ position: "relative" }}>

                <h2>NTLS Blockchain</h2>

                    <ScaleSVG
                        width={width}
                        height={height}
                    >

                        <svg
                            width={width}
                            height={height}
                        >
                            <rect
                                x={0}
                                y={0}
                                width={width}
                                height={height}
                                rx={14}
                                fill={bg}
                            />

                                <Group
                                    top={margin.top}
                                    left={margin.left}
                                >

                                    <HeatmapCircle
                                        data={data}
                                        xScale={xScale}
                                        yScale={yScale}
                                        colorScale={circleColorScale}
                                        opacityScale={opacityScale}
                                        radius={radius}
                                        gap={1}
                                        binWidth={binWidth}
                                        binHeight={binWidth}
                                    >

                                        {
                                            heatmap => {

                                            return heatmap.map(bins => {

                                                return bins.map(bin => {

                                                    const { row, column, count, rest } = bin;
                                                    {/* let datum = JSON.stringify({ row, column, ...bin.bin }); */}
                                                    {/* console.log('BIN: ', bin) */}

                                                    return (

                                                        <circle
                                                            key={`heatmap-circle-${bin.row}-${bin.column}`}
                                                            className="vx-heatmap-circle"
                                                            cx={bin.cx}
                                                            cy={bin.cy}
                                                            r={bin.r}
                                                            width={bin.width}
                                                            height={bin.height}
                                                            fill={bin.color}
                                                            fillOpacity={bin.opacity}
                                                            onClick={event => {
                                                                const {row, column, count, rest } = bin;
                                                                console.log('TOOL TIP DATA: ', tooltipData)
                                                                console.log('BIN: ', bin)
                                                            }}
                                                            onMouseOver={
                                                                event =>
                                                                handleMouseOver(
                                                                    event,
                                                                    row,
                                                                    column,
                                                                    count,
                                                                    bin.bin.bin
                                                                )
                                                            }
                                                            onMouseOut={hideTooltip}
                                                        />

                                                    );

                                                });

                                            });

                                            }
                                        }

                                    </HeatmapCircle>

                                </Group>

                            </svg>

                        </ScaleSVG>

                    {
                        tooltipOpen && (

                            <TooltipWithBounds
                                // set this to random so it correctly updates with parent bounds
                                key={Math.random()}
                                top={tooltipTop}
                                left={tooltipLeft}
                                style={{ backgroundColor: "#393939", color: "white", borderRadius: "0" }}
                            >
                                <div>
                                    <h5>
                                        <strong>Blockchain Node</strong>
                                    </h5>
                                </div>

                                <div style={{ marginTop: "5px", marginBottom: "5px", fontSize: "15px" }}>

                                    {tooltipData.rest && <div><strong>id: </strong>{tooltipData.rest}</div>}
                                    {tooltipData.row && <div><strong>row: </strong>{tooltipData.row}</div>}
                                    {tooltipData.column && <div><strong>column: </strong>{tooltipData.column}</div>}
                                    {tooltipData.count && <div><strong>count: </strong>{tooltipData.count}</div>}
                                    {tooltipData.rest.cr && <div><strong>connections: </strong>{tooltipData.rest.cr}</div>}

                                </div>

                            </TooltipWithBounds>

                        )
                    }

            </div>

        );
    }
);

export default BlockchainGraph;

// import React from "react";
// import { Group } from "@vx/group";
// import { Tree } from "@vx/hierarchy";
// import { LinkHorizontal } from "@vx/shape";
// import { hierarchy } from "d3-hierarchy";
// import { LinearGradient } from "@vx/gradient";

// const peach = "#fd9b93";
// const pink = "#fe6e9e";
// const blue = "#03c0dc";
// const green = "#26deb0";
// const plum = "#71248e";
// const lightpurple = "#374469";
// const white = "#ffffff";
// const bg = "transparent";

// const tree = {
//   name: "T",
//   children: [
//     {
//       name: "A",
//       children: [
//         { name: "A1" },
//         { name: "A2" },
//         { name: "A3" },
//         {
//           name: "C",
//           children: [
//             {
//               name: "C1"
//             },
//             {
//               name: "D",
//               children: [
//                 {
//                   name: "D1"
//                 },
//                 {
//                   name: "D2"
//                 },
//                 {
//                   name: "D3"
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     },
//     { name: "Z" },
//     {
//       name: "B",
//       children: [{ name: "B1" }, { name: "B2" }, { name: "B3" }]
//     }
//   ]
// };

// function Node({ node }) {
//   const width = 40;
//   const height = 20;
//   const centerX = -width / 2;
//   const centerY = -height / 2;
//   const isRoot = node.depth === 0;
//   const isParent = !!node.children;

//   if (isRoot) return <RootNode node={node} />;
//   if (isParent) return <ParentNode node={node} />;

//   return (
//     <Group top={node.x} left={node.y}>
//       <rect
//         height={height}
//         width={width}
//         y={centerY}
//         x={centerX}
//         fill={bg}
//         stroke={green}
//         strokeWidth={1}
//         strokeDasharray={"2,2"}
//         strokeOpacity={0.6}
//         rx={10}
//         onClick={() => {
//           alert(`clicked: ${JSON.stringify(node.data.name)}`);
//         }}
//       />
//       <text
//         dy={".33em"}
//         fontSize={9}
//         fontFamily="Arial"
//         textAnchor={"middle"}
//         fill={green}
//         style={{ pointerEvents: "none" }}
//       >
//         {node.data.name}
//       </text>
//     </Group>
//   );
// }

// function RootNode({ node }) {
//   return (
//     <Group top={node.x} left={node.y}>
//       <circle r={12} fill="url('#lg')" />
//       <text
//         dy={".33em"}
//         fontSize={9}
//         fontFamily="Arial"
//         textAnchor={"middle"}
//         style={{ pointerEvents: "none" }}
//         fill={plum}
//       >
//         {node.data.name}
//       </text>
//     </Group>
//   );
// }

// function ParentNode({ node }) {
//   const width = 40;
//   const height = 20;
//   const centerX = -width / 2;
//   const centerY = -height / 2;

//   return (
//     <Group top={node.x} left={node.y}>
//       <rect
//         height={height}
//         width={width}
//         y={centerY}
//         x={centerX}
//         fill={bg}
//         stroke={blue}
//         strokeWidth={1}
//         onClick={() => {
//           alert(`clicked: ${JSON.stringify(node.data.name)}`);
//         }}
//       />
//       <text
//         dy={".33em"}
//         fontSize={9}
//         fontFamily="Arial"
//         textAnchor={"middle"}
//         style={{ pointerEvents: "none" }}
//         fill={white}
//       >
//         {node.data.name}
//       </text>
//     </Group>
//   );
// }

// export default ({
//   width,
//   height,
//   margin = {
//     top: 10,
//     left: 30,
//     right: 40,
//     bottom: 80
//   }
// }) => {
//   const data = hierarchy(tree);
//   const yMax = height - margin.top - margin.bottom;
//   const xMax = width - margin.left - margin.right;

//   return (
//     <svg width={width} height={height}>
//       <LinearGradient id="lg" from={peach} to={pink} />
//       <rect width={width} height={height} rx={14} fill={bg} />
//       <Tree root={data} size={[yMax, xMax]}>
//         {tree => {
//           return (
//             <Group top={margin.top} left={margin.left}>
//               {tree.links().map((link, i) => {
//                 console.log(link);
//                 return (
//                   <LinkHorizontal
//                     key={`link-${i}`}
//                     data={link}
//                     stroke={lightpurple}
//                     strokeWidth="1"
//                     fill="none"
//                   />
//                 );
//               })}
//               {tree.descendants().map((node, i) => {
//                 return <Node key={`node-${i}`} node={node} />;
//               })}
//             </Group>
//           );
//         }}
//       </Tree>
//     </svg>
//   );
// };

// import React from 'react';
// import ReactDom from 'react-dom';
// import { Bar } from '@vx/shape';
// import { Group } from '@vx/group';
// import { GridRows } from '@vx/grid';
// import { GradientTealBlue } from '@vx/gradient';
// import { letterFrequency } from '@vx/mock-data';
// import { scaleBand, scaleLinear } from '@vx/scale';
// import { AxisBottom } from '@vx/axis';
// import { extent, max } from 'd3-array';

// const width = 600;
// const height = 350;

// const data = letterFrequency.slice(5);

// function round(value, precision) {
//   var multiplier = Math.pow(10, precision || 0);
//   return Math.round(value * multiplier) / multiplier;
// }

// // accessors
// const x = d => d.letter;
// const y = d => +d.frequency * 100;

// export default () => {
//   // bounds
//   const xMax = width;
//   const yMax = height - 120;

//   // scales
//   const xScale = scaleBand({
//     rangeRound: [0, xMax],
//     domain: data.map(x),
//     padding: 0.4
//   });
//   const yScale = scaleLinear({
//     rangeRound: [yMax, 0],
//     domain: [0, max(data, y)]
//   });
//   const colorScale = scaleLinear({
//     range: ['#1ae7da', 'white'],
//     domain: [0, max(data, y)]
//   });

//   return (
//     <div className="container">
//       <svg width={width} height={height}>
//         {/* <GradientTealBlue id="teal" /> */}
//         <rect
//           x={0}
//           y={0}
//           width={width}
//           height={height}
//           fill={`url(#teal)`}
//           rx={14}
//         />
//         <GridRows
//           scale={yScale}
//           width={xMax}
//           height={yMax}
//           stroke="rgba(255,255,255,0.1)"
//         />
//         <Group top={40}>
//           {data.map((d, i) => {
//             const barHeight = yMax - yScale(y(d));
//             return (
//               <Group key={`bar-${x(d)}`}>
//                 <Bar
//                   width={xScale.bandwidth()}
//                   height={barHeight}
//                   x={xScale(x(d))}
//                   y={yMax - barHeight}
//                   fill={`rgba(23, 233, 217, .5)`}
//                   data={{ x: x(d), y: y(d) }}
//                   onClick={data => event => {
//                     alert(`clicked: ${JSON.stringify(data)}`);
//                   }}
//                 />
//                 <text
//                   x={xScale(x(d))}
//                   y={yMax - barHeight}
//                   fill={colorScale(y(d))}
//                   fontSize={12}
//                   dy={'-.5em'}
//                 >
//                   {`${round(y(d), 1)}`}
//                   <tspan fontSize="8" dy="-.33em">
//                     %
//                   </tspan>
//                 </text>
//               </Group>
//             );
//           })}
//         </Group>
//         <AxisBottom
//           scale={xScale}
//           top={height - 80}
//           tickStroke="#2cc7de"
//           label={
//             <text
//               fill="white"
//               textAnchor="middle"
//               fontSize={10}
//               fontFamily="Arial"
//             >
//               Letter Frequency
//             </text>
//           }
//           tickLabelComponent={
//             <text
//               fill="#2cc7de"
//               textAnchor="middle"
//               fontSize={10}
//               fontFamily="Arial"
//             />
//           }
//           hideAxisLine
//           hideTicks
//         />
//       </svg>

//       <p>

//       </p>
//       <div>

//       </div>

//       <style jsx>{`
//         .container {
//           top: 0;
//           right: 0;
//           left: 0;
//           bottom: 0;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex-direction: column;
//           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Oxygen",
//             "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
//             sans-serif;
//         }

//         h1 {
//           margin: 1em 0;
//         }

//         p {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex-direction: row;
//           margin-bottom: 1rem;
//         }

//       `}</style>
//     </div>
//   );
// };

// import React, { useRef, useEffect } from "react";
// import ReactDOM from "react-dom";
// import G6 from "@antv/g6";
// import isArray from "@antv/util/lib/is-array";
// import { blockchainGraphData } from '../../data/shell_data';

// console.log('BCGraph Data: ', blockchainGraphData);

// export const BlockchainGraph = () => {
//     const graphContainer = useRef(null);
//     let graph = useRef(null);

//     useEffect(() => {
//       if (!graph.current) {
//         graph.current = new G6.Graph({
//           container: ReactDOM.findDOMNode(graphContainer.current),
//           width: 1080,
//           height: 200,
//           modes: {
//             default: ["drag-canvas", "name"]
//           },
//           defaultNode: {
//             type: "circle",
//             size: 30,
//             color: "#00FF0069",
//             style: {
//               lineWidth: 2,
//               fill: "#00FF0066"
//             }
//           },
//           defaultEdge: {
//             type: "cubic-horizontal",
//             color: "#e2e2e2"
//           },
//           layout: {
//             type: "grid",
//             preventOverlap: true, // nodeSize or size in data is required for preventOverlap: true
//             preventOverlapPadding: 21,
//             nodeSize: 21,
//             // condense: true,
//             rows: 3,
//             // cols: ,
//             sortBy: "degree",
//             // begin: [9, 9],
//             workerEnabled: true
//           },
//           // modes: {
//           //   default: [
//           //     "drag-canvas",
//           //     {
//           //       type: "zoom-canvas",
//           //       minZoom: 0.5,
//           //       maxZoom: 2
//           //     }
//           //   ]
//           // },
//           animate: true
//         });
//       }

//       graph.current && graph.current.data(blockchainGraphData);
//       graph.current && graph.current.render();
//     }, []);

//     /**
//      * 手动合并数据，达到异步加载的效果
//      * @param {*} data  后端返回的新数据
//      */
//     const handleChangeData = data => {
//       const prevData = graph.current && graph.current.save();
//       const newData = mergeWith(prevData, data, (objValue, srcValue) => {
//         if (isArray(objValue)) {
//           return objValue.concat(srcValue);
//         }
//       });
//       graph.current && graph.current.changeData(newData);
//     };

//     /**
//      * 模拟点击加载数据
//      * 模拟点击AoJc4qPcWeOL7NJwOh6节点后，后端返回异步加载的数据
//      * 【问题！！！】此处只增加了id为vm1234的节点，但会引发“图表1”，“图表2”两个节点对调位置
//      */
//     // const handleLoadData = () => {
//     //   const mockData = {
//     //     nodes: [
//     //       {
//     //         id: "vm1234",
//     //         label: "LAB"
//     //       }
//     //     ],
//     //     edges: [
//     //       {
//     //         source: "AoJc4qPcWeOL7NJwOh6",
//     //         target: "vm1234"
//     //       }
//     //     ]
//     //   };
//     //   handleChangeData(mockData);
//     // };

//     return (
//       <div>
//         {/* <button onClick={handleLoadData}>BT</button> */}
//         <div ref={graphContainer} className={"graph-container"} />
//       </div>
//     );
//   };

// export const BlockchainGraph = () => (
//     <h1>NTLS</h1>
// )
// export default function() {
//   const ref = React.useRef(null);
//   let graph = null;

//   useEffect(() => {
//     if (!graph) {
//       graph = new G6.Graph({
//         container: ReactDOM.findDOMNode(ref.current),
//         width: 1200,
//         height: 800,
//         modes: {
//           default: ['drag-canvas'],
//         },
//         layout: {
//           type: 'dagre',
//           direction: 'LR',
//         },
//         defaultNode: {
//           type: 'node',
//           labelCfg: {
//             style: {
//               fill: '#000000A6',
//               fontSize: 10,
//             },
//           },
//           style: {
//             stroke: '#72CC4A',
//             width: 150,
//           },
//         },
//         defaultEdge: {
//           type: 'polyline',
//         },
//       });
//     }
//     graph.data(blockchainGraphData);
//     graph.render();
//   }, []);

//   return <div ref={ref}></div>;
// }

// // The coordinate of node tooltip
// const [showNodeTooltip, setShowNodeTooltip] = useState(false);
// const [nodeTooltipX, setNodeToolTipX] = useState(0);
// const [nodeTooltipY, setNodeToolTipY] = useState(0);

// // Listen to the mouse event on node
// graph.on('node:mouseenter', evt => {
//   const { item } = evt;
//   const model = item.getModel();
//   const { x, y } = model;
//   const point = graph.getCanvasByPoint(x, y);

//   setNodeToolTipX(point.x - 75);
//   setNodeToolTipY(point.y + 15);
//   setShowNodeTooltip(true);
// });

// // Hide the tooltip and the contextMenu when the mouseleave event is activated on the node
// graph.on('node:mouseleave', () => {
//   setShowNodeTooltip(false);
// });

// return (
//   <div ref={ref}>
//     {showNodeTooltip && <NodeTooltips x={nodeTooltipX} y={nodeTooltipY} />}
//   </div>
// );

// import React from "react";
// import G6 from "@antv/g6";

// export default function BlockchainGraph() {
//   const width = document.getElementById("root").scrollWidth;
//   const height = document.getElementById("root").scrollHeight || 300;
//   const graph = new G6.Graph({
//     container: "root",
//     width,
//     height,
//     // fitView: true,
//     modes: {
//       default: ["zoom-canvas", "drag-canvas", "drag-node"]
//     },
//     nodeStateStyles: {},
//     edgeStateStyles: {},
//     layout: {
//       type: "grid",
//       begin: [9, 9],
//       width: width - 30,
//       height: height - 30,
//       rows: 3,
//       preventOverlap: true,
//       condense: true
//     },
//     defaultNode: {
//       size: 21,
//       color: "#00FF0069",
//       style: {
//         lineWidth: 2,
//         fill: "#00FF0066"
//       }
//     },
//     defaultEdge: {
//       size: 0.6,
//       color: "#e2e2e2"
//       // color: "#01e8ff"
//     }
//   });

//   fetch("https://gw.alipayobjects.com/os/antvdemo/assets/data/relations.json")
//     .then(res => res.json())
//     .then(data => {
//       console.log(data);
//       graph.data({
//         nodes: data.nodes,
//         edges: data.edges.map(function(edge, i) {
//           edge.id = "edge" + i;
//           return Object.assign({}, edge);
//         })
//       });
//       graph.render();

//       graph.on("node:dragstart", function(e) {
//         graph.layout();
//         refreshDragedNodePosition(e);
//       });
//       graph.on("node:drag", function(e) {
//         refreshDragedNodePosition(e);
//       });
//       graph.on("node:dragend", function(e) {
//         e.item.get("model").fx = null;
//         e.item.get("model").fy = null;
//       });
//     });

//   function refreshDragedNodePosition(e) {
//     const model = e.item.get("model");
//     model.fx = e.x;
//     model.fy = e.y;
//   }

//   return <div className="BlockchainGraph" />;
// }

// import React from "react";
// import G6 from "@antv/g6";
// // import "./styles.css";

// export default function BlockchainGraph() {
//   const width = document.getElementById("root").scrollWidth;
//   const height = document.getElementById("root").scrollHeight || 300;
//   const graph = new G6.Graph({
//     container: "root",
//     width,
//     height,
//     // fitView: true,
//     modes: {
//       default: ["zoom-canvas", "drag-canvas", "drag-node"]
//     },
//     nodeStateStyles: {},
//     edgeStateStyles: {},
//     layout: {
//       type: "grid",
//       begin: [9, 9],
//       width: width - 30,
//       height: height - 30,
//       rows: 3,
//       preventOverlap: true,
//       condense: true
//     },
//     defaultNode: {
//       size: 21,
//       color: "#00FF0069",
//       style: {
//         lineWidth: 2,
//         fill: "#00FF0066"
//       }
//     },
//     defaultEdge: {
//       size: 0.6,
//       color: "#e2e2e2"
//       // color: "#01e8ff"
//     }
//   });

//   fetch("https://gw.alipayobjects.com/os/antvdemo/assets/data/relations.json")
//     .then(res => res.json())
//     .then(data => {
//       console.log(data);
//       graph.data({
//         nodes: data.nodes,
//         edges: data.edges.map(function(edge, i) {
//           edge.id = "edge" + i;
//           return Object.assign({}, edge);
//         })
//       });
//       graph.render();

//       graph.on("node:dragstart", function(e) {
//         graph.layout();
//         refreshDragedNodePosition(e);
//       });
//       graph.on("node:drag", function(e) {
//         refreshDragedNodePosition(e);
//       });
//       graph.on("node:dragend", function(e) {
//         e.item.get("model").fx = null;
//         e.item.get("model").fy = null;
//       });
//     });

//   function refreshDragedNodePosition(e) {
//     const model = e.item.get("model");
//     model.fx = e.x;
//     model.fy = e.y;
//   }

//   return (
//     <div className="BlockchainGraph">
//       <div id="blockchain-container" />
//     </div>
//   );
// }

// import G6 from "@antv/g6";

// const data = {
//   nodes: [
//     {
//       id: "node1",
//       label: "Circle1",
//       x: 150,
//       y: 150
//     },
//     {
//       id: "node2",
//       label: "Circle2",
//       x: 400,
//       y: 150
//     }
//   ],
//   edges: [
//     {
//       source: "node1",
//       target: "node2"
//     }
//   ]
// };

// const graph = new G6.Graph({
//   container: "container",
//   width: 500,
//   height: 500,
//   defaultNode: {
//     shape: "circle",
//     size: [100],
//     color: "#5B8FF9",
//     style: {
//       fill: "#9EC9FF",
//       lineWidth: 3
//     },
//     labelCfg: {
//       style: {
//         fill: "#fff",
//         fontSize: 20
//       }
//     }
//   },
//   defaultEdge: {
//     style: {
//       stroke: "#e2e2e2"
//     }
//   }
// });

// graph.data(data);
// graph.render();
