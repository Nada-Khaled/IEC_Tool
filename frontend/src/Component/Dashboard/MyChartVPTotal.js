import * as React from "react";
//import * as ReactDOM from "react-dom";
import { Category, ChartComponent, ColumnSeries, Inject, Legend, LineSeries, SeriesCollectionDirective, SeriesDirective, Tooltip, DataLabel} from '@syncfusion/ej2-react-charts';

class MyChartVPTotal extends React.Component {
    constructor(props) {
        super(...arguments);
        this.primaryxAxis = { valueType: 'Category' };
        this.marker = {
            visible: true,
            height: 10, width: 10,
            //shape: 'Pentagon',
            dataLabel: { visible: true }
        };
    }
    render() {
        return( <ChartComponent id={'charts' + this.props.el} primaryXAxis={this.primaryxAxis} dataSource={this.props.data} title={this.props.title}>
        <Inject services={[ColumnSeries, Legend, Category, Tooltip, DataLabel]}/>
        <SeriesCollectionDirective>
            <SeriesDirective  xName={this.props.x} yName='integrated_sites_prices' name='Integrated Sites Total Price (EGP)' type='Column' marker={this.marker}></SeriesDirective>
            <SeriesDirective  xName={this.props.x} yName='signed_sites_prices' name='Signed Sites Total Price (EGP)' type='Column' marker={this.marker}></SeriesDirective>
        </SeriesCollectionDirective>
      </ChartComponent>)
    }
}
export default MyChartVPTotal;