import React from "react";
import Row from 'react-bootstrap/Row';
// import Countdown from "react-countdown";
// import Leaderboard from "./Leaderboard";
import RecentDonations from "./RecentDonations";

function killdisco() {
    const myNode = document.getElementById("discoBall");
    myNode.innerHTML = '';
}

function discodisco(){
    // var t = 1;
    var radius = 150;
    var squareSize = 20;
    var prec = 19.55;
    var fuzzy = 0.001;
    var inc = (Math.PI-fuzzy)/prec;
    var discoBall = document.getElementById("discoBall");
    
    for(var t=fuzzy; t<Math.PI; t+=inc) {
      var z = radius * Math.cos(t);
      var currentRadius = Math.abs((radius * Math.cos(0) * Math.sin(t)) - (radius * Math.cos(Math.PI) * Math.sin(t))) / 2.5;
      var circumference = Math.abs(2 * Math.PI * currentRadius);
      var squaresThatFit = Math.floor(circumference / squareSize);
      var angleInc = (Math.PI*2-fuzzy) / squaresThatFit;
      for(var i=angleInc/2+fuzzy; i<(Math.PI*2); i+=angleInc) {
        var square = document.createElement("div");
        var squareTile = document.createElement("div");
        squareTile.style.width = squareSize + "px";
        squareTile.style.height = squareSize + "px";
        squareTile.style.transformOrigin = "0 0 0";
        squareTile.style.webkitTransformOrigin = "0 0 0";
        squareTile.style.webkitTransform = "rotate(" + i + "rad) rotateY(" + t + "rad)";
        squareTile.style.transform = "rotate(" + i + "rad) rotateY(" + t + "rad)";
        if((t>1.3 && t<1.9) || (t<-1.3 && t>-1.9)) {
          squareTile.style.backgroundColor = randomColor("bright");
        } else {
          squareTile.style.backgroundColor = randomColor("any");
        }
        square.appendChild(squareTile);
        square.className = "square";
        squareTile.style.webkitAnimation = "reflect 2s linear infinite";
        squareTile.style.webkitAnimationDelay = String(randomNumber(0,20)/10) + "s";
        squareTile.style.animation = "reflect 2s linear infinite";
        squareTile.style.animationDelay = String(randomNumber(0,20)/10) + "s";
        squareTile.style.backfaceVisibility = "hidden";
        var x = radius * Math.cos(i) * Math.sin(t);
        var y = radius * Math.sin(i) * Math.sin(t);
        square.style.webkitTransform = "translateX(" + Math.ceil(x) + "px) translateY(" + y + "px) translateZ(" + z + "px)";
        square.style.transform = "translateX(" + x + "px) translateY(" + y + "px) translateZ(" + z + "px)";
        discoBall.appendChild(square);
      }
    }
    
    function randomColor(type) {
      var c;
      if(type === "bright") {
        c = randomNumber(130, 255);
      } else {
        c = randomNumber(110, 190);
      }
      return "rgb(" + c + "," + c + "," + c + ")";
    }
    
    function randomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            donations: [],
            pollingCount: 0,
            delay: 2000,
            teamLeaders: [],
            oldDonations: [],
            bigDonation: null
        }

    }

    componentDidMount(){
        this.interval = setInterval(this.poll, this.state.delay);
        this.poll();
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    poll = () => {
        this.setState({pollingCount: this.state.pollingCount + 1, oldDonations: this.state.donations});
        fetch('https://events.dancemarathon.com/api/events/5128/donations?limit=5')
            .then(response => response.json())
            .then(data => {
                this.setState({donations: data})
                data.forEach(d => {
                    if(!this.state.oldDonations.map(o => o.donationID).includes(d.donationID) && d.amount >= 1.0){
                        this.setState({bigDonation: d});
                        document.getElementById('donationAlert').classList.remove("donationAlertHidden");
                        document.getElementById('discoBackground').classList.remove("donationAlertHidden");
                        document.getElementById('verticalLine').classList.remove("donationAlertHidden");

                        discodisco()
                        this.start();
                    }
                });
            });
    }

    start(){
        var popup = setInterval(function() {
            document.getElementById('donationAlert').classList.add("donationAlertHidden");
            document.getElementById('discoBackground').classList.add("donationAlertHidden");
            document.getElementById('verticalLine').classList.add("donationAlertHidden");

            clearInterval(popup);
            killdisco()
        },10000);
    }

    render(){
        return <><Row className="filledRow">
            <div className="donationTable">
            <div className="donationAlert donationAlertHidden" id="donationAlert">
                    <h1><strong>{this.state.bigDonation ? this.state.bigDonation.recipientName : "Someone"}</strong> is a hero and raised <strong>${this.state.bigDonation ? this.state.bigDonation.amount.toFixed(2) : 0}</strong>!</h1>
                </div>
                <RecentDonations donations={this.state.donations}/>
            </div>
            {/* <div id="discoBallLight donationAlertHidden"></div> */}
            <div id="discoBackground" className="donationAlertHidden"></div>
            <div id="verticalLine" className="donationAlertHidden"></div>

            <div id="discoBallLight"></div>
            <div id="discoBall">
                <div id="discoBallMiddle"></div>
            </div>
            {/* <div id="discoBallMiddle"></div> */}

        </Row>
        {/* <Row>
            <div className="">
                <Leaderboard title={"Test"} leaders={this.state.teamLeaders}/>
            </div>
        </Row>*/}</>
    }
}

export default Dashboard;
