import React from 'react';

const styles = {
    root: {
        fontFamily: "HelveticaNeue-Light",
        height: "100%",
        display: "grid",
        gridTemplateRows: "10% 70%",
        gridTemplateColumns: "100%",
        gridTemplateAreas:`
        'header'
        'main'`,
    },
    header: {
        color: "black",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center",
        fontSize: "36px",
    },
    plot: {
        marginLeft: "auto",
        marginRight: "auto",
    }
};
class CompMIX extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            layout: {width: 800, height: 800, title: 'Test'},
            frames: [],
            config: {}
        };
    }

    render() {
        return (
            <div></div>
        );
    }
}

// Home.propTypes = {
//     style: PropTypes.object, 
//     title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
//     children: PropTypes.object
// };

export default CompMIX;