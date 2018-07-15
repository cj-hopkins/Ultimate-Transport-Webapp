const myRoute = '31'
const startStop = '585 Dublin Road Sutton'
const finishStop = '605 The Meadows Howth Road'

module.exports = {
    "Select a route": client => {
        const ut = client.page.ultimate_transport()
        ut.navigate().checkPageLoad()
            .selectRoute(myRoute)
        client.pause(2000);
        ut.selectStart(startStop);
        client.pause(1000)
        ut.selectFinish(finishStop);
        client.pause(2000)
        ut.getPrediction()
        client.pause(2000)
            .end();
    }
};
