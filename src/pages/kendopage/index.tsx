import {withRouter,match} from 'react-router';
import * as H from 'history';
import { Component } from 'react';
import React from 'react';

interface KendoPageProps{
    location: H.Location<H.LocationState>;
    history: H.History;
    match: match<{menuid:string}>;
}

interface KendoPageState{

}

class KendoPage extends Component<KendoPageProps,KendoPageState> {

    resizeIframe() {
        //this.setState({width: $(window).width(), height: $(window).height()});
        console.log('aaa');
    }

    componentDidMount() {
        window.addEventListener("resize", this.resizeIframe);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeIframe);
    }

    render() {
        const {match,location,history} = this.props;
        const menuid = match.params.page;
        //const menuid = location.pathname.replace(/^\/kendopage\//,'');
        return (
            <iframe width="100%" frameBorder="no"  scrolling="no" height="600px" src={'http://localhost/jreap/web/basic/codeSet/codeSet-index.html?menuid='+menuid}/>
        )
    }
}

export default withRouter(KendoPage)