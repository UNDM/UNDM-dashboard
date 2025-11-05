import React from "react";
import { Row } from "react-bootstrap";
import Countdown from "react-countdown";
import RecentDonations from "./RecentDonations";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            donations: [],
            pollingCount: 0,
            delay: 2000,
            teamLeaders: [],
            oldDonations: [],
            sumTotal: 0,
            bigDonation: null
        };
    }
    componentDidMount() {
        this.interval = setInterval(this.poll, this.state.delay);
        this.poll();
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    poll = () => {
        this.setState((prevState) => ({
            pollingCount: prevState.pollingCount + 1,
            oldDonations: prevState.donations
        }), () => {
            //to find all donations just do https://events.dancemarathon.com/api/events/<eventID>/donations
            fetch('https://events.dancemarathon.com/api/events/6713/donations?limit=5&timestamp=' + new Date().getTime()) 
            
                .then(response => response.json())
                .then(data => {
                    this.setState({ donations: data }, () => {
                        data.forEach(d => {
                            console.log("API: ",)
                            if (!this.state.oldDonations.map(o => o.donationID).includes(d.donationID) && d.amount >= 50.0) {
                                this.setState({ bigDonation: d });
                                document.getElementById('donationAlert').classList.remove("donationAlertHidden");
                                this.start();
                            }
                        });
                    });
                })
                .catch(error => console.error('Error fetching donations:', error));
        });
    };

    start() {
        var popup = setInterval(function() {
            document.getElementById('donationAlert').classList.add("donationAlertHidden");
            clearInterval(popup);
        }, 8000);
    }

    render() {
        return (
            <>
                <Row className="filledRow">
                    <div className="donationTable">
                        <div className="donationAlert donationAlertHidden" id="donationAlert">
                            <h1>
                                <strong>{this.state.bigDonation ? this.state.bigDonation.recipientName : "Someone"}</strong> is a hero and raised <strong>${this.state.bigDonation ? this.state.bigDonation.amount.toFixed(2) : 0}</strong>!
                            </h1>
                        </div>
                        <RecentDonations donations={this.state.donations} />
                    </div>
                </Row>
                {/* 
                
                The following code is for a countdown timer until Huskerthon 2025. Uncomment to use.
                
                <Row style={{ display: "inline-block" }}>
                    <div className="countdown">
                        <Countdown date={new Date("March 1, 2025 14:00:00")} daysInHours={true} />
                        <span style={{ padding: 0 }}> until Huskerthon!</span>
                    </div>
                </Row> 
                */} 
                
            </>
        );
    }
}

export default Dashboard;
