## Basic Mining Profit Calculator

This application is to aid in calculating mining income for Flux and Kaspa transactions. The results will be output to a .csv file for review.

---

### Create config.json

Please create a config.json file and follow the config layout below. You can add as many Flux or Kaspa addresses to the array.

Also, please include scanStart and scanEnd as time in seconds. You can use this site and then divide the msec output by 1000.

https://currentmillis.com/

```
{
  "kaspa": [
    {
      "kaspaAddress": "kaspa:<yourAddress>"
    }
  ],
  "flux": [
    {
      "fluxAddress": "<your 1st flux address>"
    },
    {
      "fluxAddress": "<your 2nd flux address>"
    }
  ],
  "scanStart": 1672549200,
  "scanEnd": 1703912400
}
```
