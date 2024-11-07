import { Injectable } from '@angular/core';
import moment, { Moment, unitOfTime } from 'moment';
import { StringMap, ValueData } from '../models/types';
import { DateManagerService } from './dateManager/date-manager.service';


@Injectable({
  providedIn: 'root'
})
export class DatasetFormManagerService {
  private _visFormManager: FormManager<VisDatasetItem>;
  private _exportFormManager: FormManager<ExportDatasetItem>;

  constructor(private dateHandler: DateManagerService) {
    this.setupDatasets();
  }

  ////////////// set up datasets ///////////////////
  private setupDatasets() {
    //set up form data
    ////values
    //////period
    let periodDay = new FormValue(new DisplayData("Data measured at a daily time scale.", "Daily", "day"), {period: "day"}, [true, true]);
    let period16Day = new FormValue(new DisplayData("Data measured at a 16 day time scale.", "16 Day", "16day"), {period: "16day"}, [true, true]);
    let periodMonth = new FormValue(new DisplayData("Data measured at a monthly time scale.", "Monthly", "month"), {period: "month"}, [true, true]);
    //////fill
    let fillUnfilled = new FormValue(new DisplayData("Station data including only values provided by stations before going through QA/QC.", "Unfilled", "unfilled"), {fill: "raw"}, [false, true]);
    let fillPartialFilled = new FormValue(new DisplayData("This data has undergone QA/QC and is partially filled using statistical techniques to estimate some missing station values.", "Partial Filled", "partial"), {fill: "partial"}, [false, true]);
    //////downscaling method
    let dsmDynamical = new FormValue(new DisplayData("Dynamical downscaling uses high resolution regional climate models to extrapolate lower resolution global climate models down to an area of interest.", "Dynamical", "dynamical"), {dsm: "dynamical"}, [true, true]);
    let dsmStatistical = new FormValue(new DisplayData("Statistical downscaling uses historical climatological data to statistically approximate future values.", "Statistical", "statistical"), {dsm: "statistical"}, [true, true]);
    //////climate model
    let climateRCP45 = new FormValue(new DisplayData("A climate scenario assuming peak emissions around 2040. This scenario approximates a rise in global temperature by between 2.5 and 3°C by the year 2100.", "RCP 4.5", "rcp45"), {model: "rcp45"}, [true, true]);
    let climateRCP85 = new FormValue(new DisplayData("A worst case climate scenario assuming continuously rising rates of emissions. This scenario approximates a rise in global temperature of about 5°C by the year 2100.", "RCP 8.5", "rcp85"), {model: "rcp85"}, [true, true]);
    //////season
    let seasonAnnual = new FormValue(new DisplayData("Includes all annual data.", "Annual", "annual"), {season: "annual"}, [true, true]);
    let seasonDry = new FormValue(new DisplayData("Only includes data from the wet season.", "Wet", "wet"), {season: "wet"}, [true, true]);
    let seasonWet = new FormValue(new DisplayData("Only includes data from the dry season.", "Dry", "dry"), {season: "dry"}, [true, true]);
    //////DS period
    let periodPresent = new FormValue(new DisplayData("Present day baseline values based on recorded climate data.", "Present Day", "present"), {period: "present"}, [true, true]);
    let periodMid = new FormValue(new DisplayData("Mid-century (2040-2069) projections.", "Mid-Century (2040-2069)", "mid"), {period: "mid"}, [true, true]);
    let periodLateStat = new FormValue(new DisplayData("Late-century (2070-2099) projections.", "Late-Century (2070-2099)", "late_s"), {period: "end"}, [true, true]);
    let periodLateDyn = new FormValue(new DisplayData("Late-century (2080-2099) projections.", "Late-Century (2080-2099)", "late_d"), {period: "end"}, [true, true]);
    //Climatology mean type
    let meanMonthly = new FormValue(new DisplayData("Mean monthly maps", "Mean Monthly", "mean_monthly"), {mean_type: "mean_monthly"}, [true, true]);
    let meanAnnual30 = new FormValue(new DisplayData("Annual maps averaged over a 30 year period", "Mean 30 Year Annual", "mean_30yr_annual"), {mean_type: "mean_30yr_annual"}, [true, true]);
    let meanAnnualDecadal = new FormValue(new DisplayData("Annual maps aggregated over the 2011-2020 decade", "Mean Annual Decadal", "mean_annual_decadal"), {mean_type: "mean_annual_decadal"}, [true, true]);
    //Climatology period
    let periodJanuaryLegacy = new FormValue(new DisplayData("Mean rainfall aggregated over the month of January over the years 1920-2012", "January", "january"), {period: "january"}, [true, true]);
    let periodFebruaryLegacy = new FormValue(new DisplayData("Mean rainfall aggregated over the month of February over the years 1920-2012", "February", "february"), {period: "february"}, [true, true]);
    let periodMarchLegacy = new FormValue(new DisplayData("Mean rainfall aggregated over the month of March over the years 1920-2012", "March", "march"), {period: "march"}, [true, true]);
    let periodAprilLegacy = new FormValue(new DisplayData("Mean rainfall aggregated over the month of April over the years 1920-2012", "April", "april"), {period: "april"}, [true, true]);
    let periodMayLegacy = new FormValue(new DisplayData("Mean rainfall aggregated over the month of May over the years 1920-2012", "May", "may"), {period: "may"}, [true, true]);
    let periodJuneLegacy = new FormValue(new DisplayData("Mean rainfall aggregated over the month of June over the years 1920-2012", "June", "june"), {period: "june"}, [true, true]);
    let periodJulyLegacy = new FormValue(new DisplayData("Mean rainfall aggregated over the month of July over the years 1920-2012", "July", "july"), {period: "july"}, [true, true]);
    let periodAugustLegacy = new FormValue(new DisplayData("Mean rainfall aggregated over the month of August over the years 1920-2012", "August", "august"), {period: "august"}, [true, true]);
    let periodSeptemberLegacy = new FormValue(new DisplayData("Mean rainfall aggregated over the month of September over the years 1920-2012", "September", "september"), {period: "september"}, [true, true]);
    let periodOctoberLegacy = new FormValue(new DisplayData("Mean rainfall aggregated over the month of October over the years 1920-2012", "October", "october"), {period: "october"}, [true, true]);
    let periodNovemberLegacy = new FormValue(new DisplayData("Mean rainfall aggregated over the month of November over the years 1920-2012", "November", "november"), {period: "november"}, [true, true]);
    let periodDecemberLegacy = new FormValue(new DisplayData("Mean rainfall aggregated over the month of December over the years 1920-2012", "December", "december"), {period: "december"}, [true, true]);

    let periodJanuaryContemporary = new FormValue(new DisplayData("Mean rainfall aggregated over the month of January over the years 1991-2020", "January", "january"), {period: "january"}, [true, true]);
    let periodFebruaryContemporary = new FormValue(new DisplayData("Mean rainfall aggregated over the month of February over the years 1991-2020", "February", "february"), {period: "february"}, [true, true]);
    let periodMarchContemporary = new FormValue(new DisplayData("Mean rainfall aggregated over the month of March over the years 1991-2020", "March", "march"), {period: "march"}, [true, true]);
    let periodAprilContemporary = new FormValue(new DisplayData("Mean rainfall aggregated over the month of April over the years 1991-2020", "April", "april"), {period: "april"}, [true, true]);
    let periodMayContemporary = new FormValue(new DisplayData("Mean rainfall aggregated over the month of May over the years 1991-2020", "May", "may"), {period: "may"}, [true, true]);
    let periodJuneContemporary = new FormValue(new DisplayData("Mean rainfall aggregated over the month of June over the years 1991-2020", "June", "june"), {period: "june"}, [true, true]);
    let periodJulyContemporary = new FormValue(new DisplayData("Mean rainfall aggregated over the month of July over the years 1991-2020", "July", "july"), {period: "july"}, [true, true]);
    let periodAugustContemporary = new FormValue(new DisplayData("Mean rainfall aggregated over the month of August over the years 1991-2020", "August", "august"), {period: "august"}, [true, true]);
    let periodSeptemberContemporary = new FormValue(new DisplayData("Mean rainfall aggregated over the month of September over the years 1991-2020", "September", "september"), {period: "september"}, [true, true]);
    let periodOctoberContemporary = new FormValue(new DisplayData("Mean rainfall aggregated over the month of October over the years 1991-2020", "October", "october"), {period: "october"}, [true, true]);
    let periodNovemberContemporary = new FormValue(new DisplayData("Mean rainfall aggregated over the month of November over the years 1991-2020", "November", "november"), {period: "november"}, [true, true]);
    let periodDecemberContemporary = new FormValue(new DisplayData("Mean rainfall aggregated over the month of December over the years 1991-2020", "December", "december"), {period: "december"}, [true, true]);

    let period30yrLegacy = new FormValue(new DisplayData("30 year climatology averaged over the years 1978-2007", "1978-2007", "1978-2007"), {period: "1978-2007"}, [true, true]);
    let period30yrContemporary = new FormValue(new DisplayData("30 year climatology averaged over the years 1991-2020", "1991-2020", "1991-2020"), {period: "1991-2020"}, [true, true]);
    let periodDecadal1991 = new FormValue(new DisplayData("Annual maps averaged over the 1991-2000 decade", "1991-2000", "1991-2000"), {period: "1991-2000"}, [true, true]);
    let periodDecadal2001 = new FormValue(new DisplayData("Annual maps averaged over the 2001-2010 decade", "2001-2010", "2001-2010"), {period: "2001-2010"}, [true, true]);
    let periodDecadal2011 = new FormValue(new DisplayData("Annual maps averaged over the 2011-2020 decade", "2011-2020", "2011-2020"), {period: "2011-2020"}, [true, true]);

    ////values
    //////spatial extents
    let statewideSpatialExtent = new FormValue(new DisplayData("Data covering the entire state of Hawaiʻi.", "Statewide", "statewide"), {
      extent: "statewide"
    }, null);
    let hawaiiSpatialExtent = new FormValue(new DisplayData("Data covering Hawaiʻi county.", "Hawaiʻi", "bi"), {
      extent: "bi"
    }, null);
    let mauiSpatialExtent = new FormValue(new DisplayData("Data covering Maui county.", "Maui", "mn"), {
      extent: "mn"
    }, null);
    let honoluluSpatialExtent = new FormValue(new DisplayData("Data covering Honolulu county.", "Honolulu", "oa"), {
      extent: "oa"
    }, null);
    let kauaiSpatialExtent = new FormValue(new DisplayData("Data covering Kauaʻi county.", "Kauaʻi", "ka"), {
      extent: "ka"
    }, null);
    //////units
    let mmUnits = new FormValue(new DisplayData("Values in millimeters", "mm", "mm"), {
      units: "mm"
    }, null);
    let inUnits = new FormValue(new DisplayData("Values in inches", "in", "in"), {
      units: "in"
    }, null);
    let cUnits = new FormValue(new DisplayData("Values in degrees celcius", "°C", "c"), {
      units: "celcius"
    }, null);
    let fUnits = new FormValue(new DisplayData("Values in degrees fahrenheit", "°F", "f"), {
      units: "fahrenheit"
    }, null);
    let kUnits = new FormValue(new DisplayData("Values in kelvin", "K", "k"), {
      units: "kelvin"
    }, null);
    let percentUnits = new FormValue(new DisplayData("Percent change", "%", "percent"), {
      units: "percent"
    }, null);


    let percentChangeView = new FormValue(new DisplayData("Percent change in value relative to present day conditions.", "Percent change", "percent"), {
      type: "percent"
    }, null);
    let absoluteChangeView = new FormValue(new DisplayData("Change in value relative to present day conditions.", "Absolute change", "absolute"), {
      type: "absolute"
    }, null);
    let valueView = new FormValue(new DisplayData("Projected value", "Value", "direct"), {
      type: "direct"
    }, null);


    let viewTypeDisplayData = new DisplayData("How should the data be viewed? Either view the data directly or relative to present conditions.", "View Type", "view");
    let viewTypeNodeRf = new FormNode(viewTypeDisplayData, [absoluteChangeView, percentChangeView, valueView], absoluteChangeView);
    let viewTypeNodeTemp = new FormNode(viewTypeDisplayData, [absoluteChangeView, valueView], absoluteChangeView);

    let periodNode = new FormNode(new DisplayData("The time period over which the data is measured.", "Time Period", "period"), [
      periodDay,
      periodMonth,
      period16Day
    ]);
    let fillNode = new FormNode(new DisplayData("The type of processing the station data goes through.", "Data Fill", "fill"), [
      fillUnfilled,
      fillPartialFilled
    ]);
    let dsmNode = new FormNode(new DisplayData("The type of downscaling climate model used for future projections.", "Downscaling Method", "dsm"), [
      dsmDynamical,
      dsmStatistical
    ]);
    let climateNode = new FormNode(new DisplayData("The climate model used to predict future data.", "Future Climate Model", "model"), [
      climateRCP45,
      climateRCP85
    ]);
    let seasonNode = new FormNode(new DisplayData("The season measurements and projections are made for.", "Season", "season"), [
      seasonAnnual,
      seasonDry,
      seasonWet
    ]);

    let dsPeriodStatisticalNode = new FormNode(new DisplayData("The period of coverage for the data to display, including baseline present day data and future projections", "Data Period", "ds_period"), [
      periodPresent,
      periodMid,
      periodLateStat
    ]);
    let dsPeriodDynamicalNode = new FormNode(new DisplayData("The period of coverage for the data to display, including baseline present day data and future projections", "Data Period", "ds_period"), [
      periodPresent,
      periodLateDyn
    ]);

    let dsPeriodNode = new FormNode(new DisplayData("The period of coverage for the data to display, including baseline present day data and future projections", "Data Period", "ds_period"), [
      periodPresent,
      periodMid,
      periodLateStat,
      periodLateDyn
    ]);

    let climatologyMeanTypeNode = new FormNode(new DisplayData("The type of data aggregation", "Mean Type", "mean_type"), [
      meanMonthly,
      meanAnnualDecadal,
      meanAnnual30
    ]);

    let climatologyLegacyPeriodNode = new FormNode(new DisplayData("The time period over which station data were averaged to create the map (see Giambelluca et al., 2013).", "Data Period", "cl_mean"), [
      periodJanuaryLegacy,
      periodFebruaryLegacy,
      periodMarchLegacy,
      periodAprilLegacy,
      periodMayLegacy,
      periodJuneLegacy,
      periodJulyLegacy,
      periodAugustLegacy,
      periodSeptemberLegacy,
      periodOctoberLegacy,
      periodNovemberLegacy,
      periodDecemberLegacy,
      periodDecadal1991,
      periodDecadal2001,
      periodDecadal2011,
      period30yrLegacy
    ]);
    let climatologyContemporaryPeriodNode = new FormNode(new DisplayData("The time period over which month-year maps were averaged to create the map.", "Data Period", "cl_mean"), [
      periodJanuaryContemporary,
      periodFebruaryContemporary,
      periodMarchContemporary,
      periodAprilContemporary,
      periodMayContemporary,
      periodJuneContemporary,
      periodJulyContemporary,
      periodAugustContemporary,
      periodSeptemberContemporary,
      periodOctoberContemporary,
      periodNovemberContemporary,
      periodDecemberContemporary,
      periodDecadal1991,
      periodDecadal2001,
      periodDecadal2011,
      period30yrContemporary
    ]);

    let extentDisplayData = new DisplayData("The area of coverage for the data.", "Spatial Extent", "extent");
    let unitsDisplayData = new DisplayData("The units the data are represented in.", "Units", "units");
    let extentNode = new FormNode(extentDisplayData, [statewideSpatialExtent, hawaiiSpatialExtent, mauiSpatialExtent, honoluluSpatialExtent, kauaiSpatialExtent]);
    let rfUnitsNode = new FormNode(unitsDisplayData, [mmUnits, inUnits, percentUnits]);
    let tempUnitsNode = new FormNode(unitsDisplayData, [cUnits, fUnits]);

    let rfdsUnitsNode = new FormNode(unitsDisplayData, [mmUnits, inUnits]);
    let tempdsUnitsNode = new FormNode(unitsDisplayData, [cUnits, fUnits]);
    //let percentUnitsNode = new FormNode(unitsDisplayData, [percentUnits]);

    let rfdsMap = {
      percent: null,
      absolute: rfdsUnitsNode,
      direct: rfdsUnitsNode
    };
    let tempdsMap = {
      percent: null,
      absolute: tempdsUnitsNode,
      direct: tempdsUnitsNode
    };

    // private percentRange: [number, number] = [-50, 50];
    // private absoluteRange: [number, number] = [-1000, 1000];




    ////categories
    //right now only fill data is categorized separately under station data
    let stationDataFillCategory = new FormCategory(new DisplayData("These options apply only to the station data displayed on the map. Gridded map products are generated using partial filled station data.", "Station Data", "station_data"), [
      fillNode
    ]);

    ////form data
    //new rainfall and min and max temperature all use same elements so make one and reuse
    let rainfallMinMaxTempFormData = new FormData([
      periodNode
    ], [
      stationDataFillCategory
    ]);
    //legacy and mean temperature use the same elements
    let periodOnlyFormData = new FormData([
      periodNode
    ], []);
    //rainfall downscaling data
    let dsRainfallFormData = new FormData([
      dsmNode,
      climateNode,
      seasonNode,
      dsPeriodNode
    ], []);
    let dsRainfallFormDataExport = new FormData([
      dsmNode,
      climateNode,
      seasonNode
    ], []);
    //temperature downscaling data
    let dsTemperatureFormDataExport = new FormData([
      dsmNode,
      climateNode
    ], []);
    let dsTemperatureFormData = new FormData([
      dsmNode,
      climateNode,
      dsPeriodNode
    ], []);
    let ndviFormData = new FormData([
      periodNode
    ], []);
    let fireRiskFormData = new FormData([
      periodNode
    ], []);
    let rhFormData = new FormData([
      periodNode
    ], [
      stationDataFillCategory
    ]);

    let contemporaryClimatologyFormData = new FormData([
      climatologyMeanTypeNode,
      climatologyContemporaryPeriodNode
    ], []);

    let legacyClimatologyFormData = new FormData([
      climatologyMeanTypeNode,
      climatologyLegacyPeriodNode
    ], []);

    let contemporaryClimatologyExportFormData = new FormData([
      climatologyMeanTypeNode
    ], []);

    let legacyClimatologyExportFormData = new FormData([
      climatologyMeanTypeNode
    ], []);

    //Create Focus Managers
    ////dates
    let now = moment();
    let lastMonth = now.clone().subtract(1, "month").startOf("month");
    let lastDay = now.clone().subtract(1, "day").startOf("day");
    let date1990 = moment("1990-01-01");
    let date1920 = moment("1920-01");
    let date2018 = moment("2018-12");
    let date2012 = moment("2012-12");
    let dateNDVIStart = moment("2000-02-18");
    let dateNDVIEnd = moment("2023-07-12");
    let dateRHStart = moment("2002-01-01");
    let dateFireRiskStart = moment("2002-01-01");
    let dateFireRiskEnd = moment("2024=08-13");
    ////periods
    let yearPeriod = new PeriodData("year", 1, "year");
    let monthPeriod = new PeriodData("month", 1, "month");
    let dayPeriod = new PeriodData("day", 1, "day");
    let day16Period = new PeriodData("day", 16, "16day");
    ////focus managers
    let rainfallMonthFocusManager = new TimeseriesData(date1990, lastMonth, monthPeriod, yearPeriod, this.dateHandler, lastMonth);
    let temperatureRainfallDayFocusManager = new TimeseriesData(date1990, lastDay, dayPeriod, monthPeriod, this.dateHandler, lastDay);
    let legacyRainfallFocusManager = new TimeseriesData(date1920, date2012, monthPeriod, yearPeriod, this.dateHandler, date2012);
    let temperatureMonthFocusManager = new TimeseriesData(date1990, lastMonth, monthPeriod, yearPeriod, this.dateHandler, date2018);
    let dsDynamicalFocusManager = new TimeSelectorData(dsPeriodDynamicalNode, periodPresent);
    let dsStatisticalFocusManager = new TimeSelectorData(dsPeriodStatisticalNode, periodPresent);
    let ndviFocusManager = new NDVITimeseriesData(dateNDVIStart, dateNDVIEnd, day16Period, yearPeriod, this.dateHandler, dateNDVIEnd);
    let fireRiskFocusManager = new TimeseriesData(dateFireRiskStart, dateFireRiskEnd, dayPeriod, monthPeriod, this.dateHandler, dateFireRiskEnd);
    let rhFocusManager = new TimeseriesData(dateRHStart, lastDay, dayPeriod, monthPeriod, this.dateHandler, lastDay);
    let climatologyFocusManager = new TimeSelectorData(climatologyContemporaryPeriodNode, periodJanuaryContemporary);

    //cleanup the timeseries refs in model
    //Create Datasets
    ////Dataset Items
    //////Rainfall
    let rainfallMonthPartial = new VisDatasetItem(true, true, "Millimeters", "mm", "Rainfall", "Monthly Rainfall", [0, 650], [true, false], rainfallMonthFocusManager, [rainfallMonthFocusManager, temperatureRainfallDayFocusManager], false, {
      period: "month",
      fill: "partial"
    });
    let rainfallDayPartial = new VisDatasetItem(true, true, "Millimeters", "mm", "Rainfall", "Daily Rainfall", [0, 20], [true, false], temperatureRainfallDayFocusManager, [rainfallMonthFocusManager, temperatureRainfallDayFocusManager], false, {
      period: "day",
      fill: "partial"
    });
    let rainfallDayUnfilled = new VisDatasetItem(true, true, "Millimeters", "mm", "Rainfall", "Daily Rainfall", [0, 20], [true, false], temperatureRainfallDayFocusManager, [rainfallMonthFocusManager, temperatureRainfallDayFocusManager], false, {
      period: "day",
      fill: "unfilled"
    });
    //////Legacy Rainfall
    let legacyRainfallMonth = new VisDatasetItem(false, true, "Millimeters", "mm", "Rainfall", "Monthly Rainfall", [0, 650], [true, false], legacyRainfallFocusManager, [legacyRainfallFocusManager], false, {
      period: "month"
    });
    //////Min Temperature
    let minTemperatureMonthPartial = new VisDatasetItem(true, true, "Celcius", "°C", "Minimum Temperature", "Monthly Minimum Temperature", [-10, 35], [false, false], temperatureMonthFocusManager, [temperatureMonthFocusManager, temperatureRainfallDayFocusManager], true, {
      period: "month",
      fill: "partial"
    });
    let minTemperatureDayPartial = new VisDatasetItem(true, true, "Celcius", "°C", "Minimum Temperature", "Daily Minimum Temperature", [-10, 35], [false, false], temperatureRainfallDayFocusManager, [temperatureMonthFocusManager, temperatureRainfallDayFocusManager], true, {
      period: "day",
      fill: "partial"
    });
    //////Max Temperature
    let maxTemperatureMonthPartial = new VisDatasetItem(true, true, "Celcius", "°C", "Maximum Temperature", "Monthly Maximum Temperature", [-10, 35], [false, false], temperatureMonthFocusManager, [temperatureMonthFocusManager, temperatureRainfallDayFocusManager], true, {
      period: "month",
      fill: "partial"
    });
    let maxTemperatureDayPartial = new VisDatasetItem(true, true, "Celcius", "°C", "Maximum Temperature", "Daily Maximum Temperature", [-10, 35], [false, false], temperatureRainfallDayFocusManager, [temperatureMonthFocusManager, temperatureRainfallDayFocusManager], true, {
      period: "day",
      fill: "partial"
    });
    //////Mean Temperature
    let meanTemperatureMonth = new VisDatasetItem(false, true, "Celcius", "°C", "Mean Temperature", "Monthly Mean Temperature", [-10, 35], [false, false], temperatureMonthFocusManager, [temperatureMonthFocusManager, temperatureRainfallDayFocusManager], true, {
      period: "month"
    });
    let meanTemperatureDay = new VisDatasetItem(false, true, "Celcius", "°C", "Mean Temperature", "Daily Mean Temperature", [-10, 35], [false, false], temperatureRainfallDayFocusManager, [temperatureMonthFocusManager, temperatureRainfallDayFocusManager], true, {
      period: "day"
    });

    //RH
    let rhDayPartial = new VisDatasetItem(true, true, "Percent", "%", "Relative Humidity", "Daily Relative Humidity", [0, 100], [true, true], rhFocusManager, [rhFocusManager], false, {
      period: "day",
      fill: "partial"
    });
    // let rhDayRaw = new VisDatasetItem(true, true, "Percent", "%", "Relative Humidity", "Daily Relative Humidity", [0, 100], [true, true], rhFocusManager, [rhFocusManager], false, {
    //   period: "day",
    //   fill: "unfilled"
    // });

    //climatologies
    let contemporaryRainfallClimatologySets = [];
    let legacyRainfallClimatologySets = [];
    let contemporaryMeanTemperatureClimatologySets = [];
    let contemporaryMaxTemperatureClimatologySets = [];
    let contemporaryMinTemperatureClimatologySets = [];
    let legacyMeanTemperatureClimatologySets = [];
    let legacyMaxTemperatureClimatologySets = [];
    let legacyMinTemperatureClimatologySets = [];
    let months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    for(let month of months) {
      let capMonth = month.charAt(0).toUpperCase() + month.slice(1);
      let contemporaryRainfallClimatology = new VisDatasetItem(false, true, "Millimeters", "mm", "Rainfall", `${capMonth} Mean Rainfall`, [0, 650], [true, false], climatologyFocusManager, [], false, {
        mean_type: "mean_monthly",
        cl_mean: month
      });
      let legacyRainfallClimatology = new VisDatasetItem(false, true, "Millimeters", "mm", "Rainfall", `${capMonth} Mean Rainfall`, [0, 650], [true, false], climatologyFocusManager, [], false, {
        mean_type: "mean_monthly",
        cl_mean: month
      });
      contemporaryRainfallClimatologySets.push(contemporaryRainfallClimatology);
      legacyRainfallClimatologySets.push(legacyRainfallClimatology);
      let contemporaryMeanTemperatureClimatology = new VisDatasetItem(false, true, "Celcius", "°C", "Mean Temperature", `${capMonth} Mean Temperature`, [-10, 35], [false, false], climatologyFocusManager, [], true, {
        mean_type: "mean_monthly",
        cl_mean: month
      });
      let contemporaryMaxTemperatureClimatology = new VisDatasetItem(false, true, "Celcius", "°C", "Maximum Temperature", `${capMonth} Maximum Temperature`, [-10, 35], [false, false], climatologyFocusManager, [], true, {
        mean_type: "mean_monthly",
        cl_mean: month
      });
      let contemporaryMinTemperatureClimatology = new VisDatasetItem(false, true, "Celcius", "°C", "Minimum Temperature", `${capMonth} Minimum Temperature`, [-10, 35], [false, false], climatologyFocusManager, [], true, {
        mean_type: "mean_monthly",
        cl_mean: month
      });
      let legacyMeanTemperatureClimatology = new VisDatasetItem(false, true, "Celcius", "°C", "Mean Temperature", `${capMonth} Mean Temperature`, [-10, 35], [false, false], climatologyFocusManager, [], true, {
        mean_type: "mean_monthly",
        cl_mean: month
      });
      let legacyMaxTemperatureClimatology = new VisDatasetItem(false, true, "Celcius", "°C", "Maximum Temperature", `${capMonth} Maximum Temperature`, [-10, 35], [false, false], climatologyFocusManager, [], true, {
        mean_type: "mean_monthly",
        cl_mean: month
      });
      let legacyMinTemperatureClimatology = new VisDatasetItem(false, true, "Celcius", "°C", "Minimum Temperature", `${capMonth} Minimum Temperature`, [-10, 35], [false, false], climatologyFocusManager, [], true, {
        mean_type: "mean_monthly",
        cl_mean: month
      });
      contemporaryMeanTemperatureClimatologySets.push(contemporaryMeanTemperatureClimatology);
      contemporaryMaxTemperatureClimatologySets.push(contemporaryMaxTemperatureClimatology);
      contemporaryMinTemperatureClimatologySets.push(contemporaryMinTemperatureClimatology);
      legacyMeanTemperatureClimatologySets.push(legacyMeanTemperatureClimatology);
      legacyMaxTemperatureClimatologySets.push(legacyMaxTemperatureClimatology);
      legacyMinTemperatureClimatologySets.push(legacyMinTemperatureClimatology);
    }
    let yearsDecadal = ["1991-2000", "2001-2010", "2011-2020"];
    for(let decade of yearsDecadal) {
      let contemporaryRainfallClimatology = new VisDatasetItem(false, true, "Millimeters", "mm", "Rainfall", `${decade} Mean Rainfall`, [0, 10000], [true, false], climatologyFocusManager, [], false, {
        mean_type: "mean_annual_decadal",
        cl_mean: decade
      });
      contemporaryRainfallClimatologySets.push(contemporaryRainfallClimatology);
      let contemporaryMeanTemperatureClimatology = new VisDatasetItem(false, true, "Celcius", "°C", "Mean Temperature", `${decade} Mean Temperature`, [-10, 35], [false, false], climatologyFocusManager, [], true, {
        mean_type: "mean_annual_decadal",
        cl_mean: decade
      });
      let contemporaryMaxTemperatureClimatology = new VisDatasetItem(false, true, "Celcius", "°C", "Maximum Temperature", `${decade} Maximum Temperature`, [-10, 35], [false, false], climatologyFocusManager, [], true, {
        mean_type: "mean_annual_decadal",
        cl_mean: decade
      });
      let contemporaryMinTemperatureClimatology = new VisDatasetItem(false, true, "Celcius", "°C", "Minimum Temperature", `${decade} Minimum Temperature`, [-10, 35], [false, false], climatologyFocusManager, [], true, {
        mean_type: "mean_annual_decadal",
        cl_mean: decade
      });
      contemporaryMeanTemperatureClimatologySets.push(contemporaryMeanTemperatureClimatology);
      contemporaryMaxTemperatureClimatologySets.push(contemporaryMaxTemperatureClimatology);
      contemporaryMinTemperatureClimatologySets.push(contemporaryMinTemperatureClimatology);
    }

    let contemporaryRainfallClimatology = new VisDatasetItem(false, true, "Millimeters", "mm", "Rainfall", `1991-2020 Mean Rainfall`, [0, 10000], [true, false], climatologyFocusManager, [], false, {
      mean_type: "mean_30yr_annual",
      cl_mean: "1991-2020"
    });
    let legacyRainfallClimatology = new VisDatasetItem(false, true, "Millimeters", "mm", "Rainfall", `1978-2007 Mean Rainfall`, [0, 10000], [true, false], climatologyFocusManager, [], false, {
      mean_type: "mean_30yr_annual",
      cl_mean: "1978-2007"
    });
    contemporaryRainfallClimatologySets.push(contemporaryRainfallClimatology);
    legacyRainfallClimatologySets.push(legacyRainfallClimatology);
    let contemporaryMeanTemperatureClimatology = new VisDatasetItem(false, true, "Celcius", "°C", "Mean Temperature", `1991-2020 Mean Temperature`, [-10, 35], [false, false], climatologyFocusManager, [], true, {
      mean_type: "mean_30yr_annual",
      cl_mean: "1991-2020"
    });
    let contemporaryMaxTemperatureClimatology = new VisDatasetItem(false, true, "Celcius", "°C", "Maximum Temperature", `1991-2020 Maximum Temperature`, [-10, 35], [false, false], climatologyFocusManager, [], true, {
      mean_type: "mean_30yr_annual",
      cl_mean: "1991-2020"
    });
    let contemporaryMinTemperatureClimatology = new VisDatasetItem(false, true, "Celcius", "°C", "Minimum Temperature", `1991-2020 Minimum Temperature`, [-10, 35], [false, false], climatologyFocusManager, [], true, {
      mean_type: "mean_30yr_annual",
      cl_mean: "1991-2020"
    });
    let legacyMeanTemperatureClimatology = new VisDatasetItem(false, true, "Celcius", "°C", "Mean Temperature", `1978-2007 Mean Temperature`, [-10, 35], [false, false], climatologyFocusManager, [], true, {
      mean_type: "mean_30yr_annual",
      cl_mean: "1978-2007"
    });
    let legacyMaxTemperatureClimatology = new VisDatasetItem(false, true, "Celcius", "°C", "Maximum Temperature", `1978-2007 Maximum Temperature`, [-10, 35], [false, false], climatologyFocusManager, [], true, {
      mean_type: "mean_30yr_annual",
      cl_mean: "1978-2007"
    });
    let legacyMinTemperatureClimatology = new VisDatasetItem(false, true, "Celcius", "°C", "Minimum Temperature", `1978-2007 Minimum Temperature`, [-10, 35], [false, false], climatologyFocusManager, [], true, {
      mean_type: "mean_30yr_annual",
      cl_mean: "1978-2007"
    });
    contemporaryMeanTemperatureClimatologySets.push(contemporaryMeanTemperatureClimatology);
    contemporaryMaxTemperatureClimatologySets.push(contemporaryMaxTemperatureClimatology);
    contemporaryMinTemperatureClimatologySets.push(contemporaryMinTemperatureClimatology);
    legacyMeanTemperatureClimatologySets.push(legacyMeanTemperatureClimatology);
    legacyMaxTemperatureClimatologySets.push(legacyMaxTemperatureClimatology);
    legacyMinTemperatureClimatologySets.push(legacyMinTemperatureClimatology);

    //////DS
    let dsm = [["statistical", "Statistically Downscaled"], ["dynamical", "Dynamically Downscaled"]];
    let model = [["rcp45", "RCP 4.5"], ["rcp85", "RCP 8.5"]];
    let season = [["annual", "Annual", [0, 10000]], ["wet", "Wet Season", [0, 5000]], ["dry", "Dry Season", [0, 5000]]];
    ////////Rainfall
    let dsRainfallItems = [];
    for(let dsmItem of dsm) {
      let period = [["present", "Present Day"], ["mid", "2040-2069"], ["late_s", "2070-2099"]];
      if(dsmItem[0] == "dynamical") {
        period = [["present", "Present Day"], ["late_d", "2080-2099"]];
      }
      for(let modelItem of model) {
        for(let seasonItem of season) {
          for(let periodItem of period) {

            //RF
            //need different maps for each thing
            let unitRepMap: ViewDataMap = {
              percent: {
                displayStyle: "diverging",
                units: {
                  percent: {
                    unit: "Percent",
                    short: "%",
                    range: [-50, 50]
                  }
                }
              },
              absolute: {
                displayStyle: "diverging",
                units: {
                  mm: {
                    unit: "Millimeters",
                    short: "mm",
                    range: seasonItem[0] == "annual" ? [-1000, 1000] : [-500, 500]
                  },
                  in: {
                    unit: "Inches",
                    short: "in",
                    range: seasonItem[0] == "annual" ? [-39, 39] : [-20, 20]
                  }
                }
              },
              direct: {
                displayStyle: "standard",
                units: {
                  mm: {
                    unit: "Millimeters",
                    short: "mm",
                    range: seasonItem[0] == "annual" ? [0, 10000] : [0, 5000]
                  },
                  in: {
                    unit: "Inches",
                    short: "in",
                    range: seasonItem[0] == "annual" ? [0, 394] : [0, 197]
                  }
                }
              }
            }

            let rfdsOptionData: OptionData = new OptionData(viewTypeNodeRf, rfdsMap, unitRepMap, "absolute", "mm");
            let rfdsPresentOptionData: OptionData = new OptionData(viewTypeNodeRf.filter(["direct"]), rfdsMap, unitRepMap, "direct", "mm");


            let optionData = periodItem[0] == "present" ? rfdsPresentOptionData : rfdsOptionData;
            let datasetItem = new VisDatasetItem(false, true, "Millimeters", "mm", "Rainfall", `${dsmItem[1]} ${seasonItem[1]} Rainfall (${modelItem[1]}) — ${periodItem[1]}`, <[number, number]>seasonItem[2], [true, false], dsStatisticalFocusManager, null, false, {
              dsm: dsmItem[0],
              model: modelItem[0],
              season: <string>seasonItem[0],
              ds_period: periodItem[0]
            }, optionData);
            dsRainfallItems.push(datasetItem);
          }
        }
      }
    }

    ////////Temperature
    let dsTemperatureItems = [];
    for(let dsmItem of dsm) {
      let period = [["present", "Present Day"], ["mid", "2040-2069"], ["late_s", "2070-2099"]];
      if(dsmItem[0] == "dynamical") {
        period = [["present", "Present Day"], ["late_d", "2080-2099"]];
      }
      for(let modelItem of model) {
        for(let periodItem of period) {
          let unitRepMap: ViewDataMap = {
            percent: {
              displayStyle: "increasing",
              units: {
                percent: {
                  unit: "Percent",
                  short: "%",
                  range: [-50, 50]
                }
              }
            },
            absolute: {
              displayStyle: "increasing",
              units: {
                c: {
                  unit: "Celcius",
                  short: "°C",
                  range: [1.25, 4.25]
                },
                f: {
                  unit: "Fahrenheit",
                  short: "°F",
                  range: [2.25, 7.65]
                }
              }
            },
            direct: {
              displayStyle: "standard",
              units: {
                c: {
                  unit: "Celcius",
                  short: "°C",
                  range: [-10, 35]
                },
                f: {
                  unit: "Fahrenheit",
                  short: "°F",
                  range: [14, 95]
                }
              }
            }
          }

          let tempdsOptionData: OptionData = new OptionData(viewTypeNodeTemp, tempdsMap, unitRepMap, "absolute", "c");
          let tempdsPresentOptionData: OptionData = new OptionData(viewTypeNodeTemp.filter(["direct"]), tempdsMap, unitRepMap, "direct", "c");


          let optionData = periodItem[0] == "present" ? tempdsPresentOptionData : tempdsOptionData;
          let datasetItem = new VisDatasetItem(false, true, "Celcius", "°C", "Temperature", `${dsmItem[1]} Temperature (${modelItem[1]}) — ${periodItem[1]}`, [-10, 35], [true, false], dsStatisticalFocusManager, null, false, {
            dsm: dsmItem[0],
            model: modelItem[0],
            ds_period: periodItem[0]
          }, optionData);
          dsTemperatureItems.push(datasetItem);
        }
      }
    }

    //////NDVI
    let ndvi = new VisDatasetItem(false, true, "", "", "NDVI", "NDVI", [-0.2, 1], [false, true], ndviFocusManager, [ndviFocusManager], false, {
      period: "16day"
    });

    //Fire risk
    let fireRiskDay = new VisDatasetItem(false, true, "", "", "Fire Risk", "Fire Risk", [0, 1], [true, true], fireRiskFocusManager, [fireRiskFocusManager], true, {
      period: "day"
    });

    ////Datasets
    let rainfallDatasetDisplayData = new DisplayData("Rainfall data (1990 - present).", "Rainfall", "rainfall");
    let legacyRainfallDatasetDisplayData = new DisplayData("Legacy rainfall data based on older production methods (1920 - 2012).", "Legacy Rainfall", "legacy_rainfall");
    let maxTemperatureDatasetDisplayData = new DisplayData("Temperature data aggregated to its maximum value over the time period.", "Maximum Temperature", "max_temp");
    let minTemperatureDatasetDisplayData = new DisplayData("Temperature data aggregated to its minimum value over the time period.", "Minimum Temperature", "min_temp");
    let meanTemperatureDatasetDisplayData = new DisplayData("Temperature data aggregated to its average value over the time period.", "Mean Temperature", "mean_temp");
    let dsRainfallDatasetDisplayData = new DisplayData("Downscaled future projections for rainfall data.", "Rainfall Projections", "ds_rainfall");
    let dsTemperatureDatasetDisplayData = new DisplayData("Downscaled future projections for temperature data.", "Temperature Projections", "ds_temp");
    let ndviDatasetDisplayData = new DisplayData("Normalized Difference Vegetation Index", "NDVI", "ndvi");
    let rhDatasetDisplayData = new DisplayData("Relative humidity data", "Relative Humidity", "rh");
    let fireRiskDatasetDisplayData = new DisplayData("Probability of fire ignition based on environmental conditions", "Fire Risk", "fire_risk");

    let contemporaryRainfallClimatologyDatasetDisplayData = new DisplayData("Mean rainfall climatologies", "Mean Rainfall", "contemporary_mean_rf_climatology");
    let legacyRainfallClimatologyDatasetDisplayData = new DisplayData("Mean rainfall climatologies", "Mean Rainfall", "legacy_mean_rf_climatology");
    let contemporaryMeanTemperatureClimatologyDatasetDisplayData = new DisplayData("Mean air temperature climatologies", "Mean Air Temperature", "contemporary_mean_temp_climatology");
    let contemporaryMaxTemperatureClimatologyDatasetDisplayData = new DisplayData("Maximum air temperature climatologies", "Maximum Air Temperature", "contemporary_max_temp_climatology");
    let contemporaryMinTemperatureClimatologyDatasetDisplayData = new DisplayData("Minimum air temperature climatologies", "Minimum Air Temperature", "contemporary_min_temp_climatology");
    let legacyMeanTemperatureClimatologyDatasetDisplayData = new DisplayData("Mean air temperature climatologies", "Mean Air Temperature", "legacy_mean_temp_climatology");
    let legacyMaxTemperatureClimatologyDatasetDisplayData = new DisplayData("Maximum air temperature climatologies", "Maximum Air Temperature", "legacy_max_temp_climatology");
    let legacyMinTemperatureClimatologyDatasetDisplayData = new DisplayData("Minimum air temperature climatologies", "Minimum Air Temperature", "legacy_min_temp_climatology");

    let rainfallVisDataset = new Dataset<VisDatasetItem>(rainfallDatasetDisplayData, {
      datatype: "rainfall",
      production: "new"
    }, rainfallMinMaxTempFormData, [
      rainfallMonthPartial,
      rainfallDayPartial,
      rainfallDayUnfilled
    ]);
    let legacyRainfallVisDataset = new Dataset<VisDatasetItem>(legacyRainfallDatasetDisplayData, {
      datatype: "rainfall",
      production: "legacy"
    }, periodOnlyFormData, [
      legacyRainfallMonth
    ]);
    let maxTemperatureVisDataset = new Dataset<VisDatasetItem>(maxTemperatureDatasetDisplayData, {
      datatype: "temperature",
      aggregation: "max"
    }, rainfallMinMaxTempFormData, [
      maxTemperatureMonthPartial,
      maxTemperatureDayPartial
    ]);
    let minTemperatureVisDataset = new Dataset<VisDatasetItem>(minTemperatureDatasetDisplayData, {
      datatype: "temperature",
      aggregation: "min"
    }, rainfallMinMaxTempFormData, [
      minTemperatureMonthPartial,
      minTemperatureDayPartial
    ]);
    let meanTemperatureVisDataset = new Dataset<VisDatasetItem>(meanTemperatureDatasetDisplayData, {
      datatype: "temperature",
      aggregation: "mean"
    }, periodOnlyFormData, [
      meanTemperatureDay,
      meanTemperatureMonth
    ]);
    let dsRainfallVisDataset = new Dataset<VisDatasetItem>(dsRainfallDatasetDisplayData, {
      datatype: "downscaling_rainfall"
    }, dsRainfallFormData, dsRainfallItems);
    let dsTemperatureVisDataset = new Dataset<VisDatasetItem>(dsTemperatureDatasetDisplayData, {
      datatype: "downscaling_temperature"
    }, dsTemperatureFormData, dsTemperatureItems);
    let ndviVisDataset = new Dataset<VisDatasetItem>(ndviDatasetDisplayData, {
      datatype: "ndvi"
    }, ndviFormData, [
      ndvi
    ]);
    let rhVisDataset = new Dataset<VisDatasetItem>(rhDatasetDisplayData, {
      datatype: "relative_humidity"
    }, rhFormData, [
      rhDayPartial,
      //rhDayRaw
    ]);
    let fireRiskVisDataset = new Dataset<VisDatasetItem>(fireRiskDatasetDisplayData, {
      datatype: "fire_risk"
    }, fireRiskFormData, [
      fireRiskDay
    ]);

    let contemporaryRainfallClimatologyVisDataset = new Dataset<VisDatasetItem>(contemporaryRainfallClimatologyDatasetDisplayData, {
      datatype: "contemporary_climatology",
      variable: "rainfall"
    }, contemporaryClimatologyFormData, contemporaryRainfallClimatologySets);
    let legacyRainfallClimatologyVisDataset = new Dataset<VisDatasetItem>(legacyRainfallClimatologyDatasetDisplayData, {
      datatype: "legacy_climatology",
      variable: "rainfall"
    }, legacyClimatologyFormData, legacyRainfallClimatologySets);
    let contemporaryMeanTemperatureClimatologyVisDataset = new Dataset<VisDatasetItem>(contemporaryMeanTemperatureClimatologyDatasetDisplayData, {
      datatype: "contemporary_climatology",
      variable: "air_temperature",
      aggregation: "mean"
    }, contemporaryClimatologyFormData, contemporaryMeanTemperatureClimatologySets);
    let contemporaryMaxTemperatureClimatologyVisDataset = new Dataset<VisDatasetItem>(contemporaryMaxTemperatureClimatologyDatasetDisplayData, {
      datatype: "contemporary_climatology",
      variable: "air_temperature",
      aggregation: "max"
    }, contemporaryClimatologyFormData, contemporaryMaxTemperatureClimatologySets);
    let contemporaryMinTemperatureClimatologyVisDataset = new Dataset<VisDatasetItem>(contemporaryMinTemperatureClimatologyDatasetDisplayData, {
      datatype: "contemporary_climatology",
      variable: "air_temperature",
      aggregation: "min"
    }, contemporaryClimatologyFormData, contemporaryMinTemperatureClimatologySets);
    let legacyMeanTemperatureClimatologyVisDataset = new Dataset<VisDatasetItem>(legacyMeanTemperatureClimatologyDatasetDisplayData, {
      datatype: "legacy_climatology",
      variable: "air_temperature",
      aggregation: "mean"
    }, legacyClimatologyFormData, legacyMeanTemperatureClimatologySets);
    let legacyMaxTemperatureClimatologyVisDataset = new Dataset<VisDatasetItem>(legacyMaxTemperatureClimatologyDatasetDisplayData, {
      datatype: "legacy_climatology",
      variable: "air_temperature",
      aggregation: "max"
    }, legacyClimatologyFormData, legacyMaxTemperatureClimatologySets);
    let legacyMinTemperatureClimatologyVisDataset = new Dataset<VisDatasetItem>(legacyMinTemperatureClimatologyDatasetDisplayData, {
      datatype: "legacy_climatology",
      variable: "air_temperature",
      aggregation: "min"
    }, legacyClimatologyFormData, legacyMinTemperatureClimatologySets);



    //////////////////////////////////////////////////////////////////////
    /////////////////////////////// export ///////////////////////////////
    //////////////////////////////////////////////////////////////////////

    //filetypes
    let geotiffFtype = new FileType("GeoTIFF", "tif", "GeoTIFF files are a variant of the TIFF file format which is used to store raster based data/graphics including georeferencing information.");
    let txtFtype = new FileType("Text", "txt", "A plaintext file.");
    let csvFtype = new FileType("Comma-Separated Values", "csv", "A text based file with data separated by commas.");
    let pdfFtype = new FileType("PDF", "pdf", "A portable document format file.");
    //file display data
    let rainfallMapDisplayData = new DisplayData("A gridded rainfall map representing estimated rainfall values over the state of Hawaiʻi.", "Rainfall Map", "data_map");
    let temperatureMapDisplayData = new DisplayData("A gridded temperature map representing the estimated temperature values over the state of Hawaiʻi.", "Temperature Map", "data_map");
    let dsRainfallMapDisplayData = new DisplayData("A gridded rainfall map representing estimated present day or predicted future rainfall values.", "Rainfall Map", "data_map");
    let dsRainfallMapChangeDisplayData = new DisplayData("A gridded map displaying the predicted change in rainfall from present day conditions.", "Rainfall Change Map", "data_map_change"); //includes percent
    let dsTemperatureMapDisplayData = new DisplayData("A gridded rainfall map representing estimated present day or predicted future average temperature values.", "Temperature Map", "data_map");
    let dsTemperatureMapChangeDisplayData = new DisplayData("A gridded map displaying the predicted change in temperature from present day conditions.", "Temperature Change Map", "data_map_change");
    let standardErrorMapDisplayData = new DisplayData("The standard error values for the gridded map data.", "Standard Error Map", "se");
    let anomalyDisplayData = new DisplayData("The anomaly values for the gridded map.", "Anomaly Map", "anom");
    let anomalyStandardErrorDisplayData = new DisplayData("The standard error values for the gridded map's anomaly values.", "Anomaly Standard Error", "anom_se");
    let metadataDisplayData = new DisplayData("Gridded map product metadata and error metrics.", "Metadata and Error Metrics", "metadata");
    let stationPartialDisplayData = new DisplayData("Processed station data including each station's metadata and values over a period of time", "Station Data", "station_data");
    let ndviDisplayData = new DisplayData("A gridded normalized difference vegetation index (NDVI) map representing estimated values over the state of Hawaiʻi.", "NDVI Map", "data_map");
    let fireRiskMapDisplayData = new DisplayData("A gridded fire risk map representing the likelihood of fire ignition over the state of Hawaiʻi.", "Fire Risk Map", "data_map");
    let rhMapDisplayData = new DisplayData("A gridded relative humidity map representing estimated relative humidity percentages over the state of Hawaiʻi.", "Relative Humidity Map", "data_map");
    let climatologyRainfallMapDisplayData = new DisplayData("A gridded map displaying the average estimated rainfall over the selected time period.", "Rainfall Map", "data_map");
    let climatologyTemperatureMapDisplayData = new DisplayData("A gridded map displaying the average estimated mean temperature over the selected time period.", "Temperature Map", "data_map");

    //additional property nodes





    ////nodes

    //fileProperties
    let allExtentProperty = new FileProperty(extentNode, ["statewide"]);
    let statewideProperty = new FileProperty(extentNode.filter(["statewide"]), ["statewide"]);
    let percentUnitsProperty = new FileProperty(rfUnitsNode.filter(["percent"]), ["percent"]);
    let rfAllUnitsProperty = new FileProperty(rfUnitsNode.filter(["mm", "in"]), ["mm"]);
    let rfMmUnitsProperty = new FileProperty(rfUnitsNode.filter(["mm"]), ["mm"]);
    let rfChangeUnitsProperty = new FileProperty(rfUnitsNode, ["mm"]);
    let tempAllUnitsProperty = new FileProperty(tempUnitsNode, ["c"]);
    let tempCUnitsProperty = new FileProperty(tempUnitsNode.filter(["c"]), ["c"]);
    let fillProperty = new FileProperty(fillNode, ["partial"]);
    let fillPartialProperty = new FileProperty(fillNode.filter(["partial"]), ["partial"]);
    let fillUnfilledProperty = new FileProperty(fillNode.filter(["unfilled"]), ["unfilled"]);
    let dsPeriodStatisticalAllProperty = new FileProperty(dsPeriodStatisticalNode, ["present"]);
    let dsPeriodStatisticalFutureProperty = new FileProperty(dsPeriodStatisticalNode.filter(["mid", "late_s"]), ["mid"]);
    let dsPeriodDynamicalAllProperty = new FileProperty(dsPeriodDynamicalNode, ["present"]);
    let dsPeriodDynamicalFutureProperty = new FileProperty(dsPeriodDynamicalNode.filter(["late_d"]), ["late_d"]);
    let ndviPeriodProperty = new FileProperty(periodNode.filter(["16day"]), ["16day"]);

    let monthLegacyClimatologyProperty = new FileProperty(climatologyLegacyPeriodNode.filter(["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]), ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]);
    let monthContemporaryClimatologyProperty = new FileProperty(climatologyContemporaryPeriodNode.filter(["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]), ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]);

    let decadalClimatologyProperty = new FileProperty(climatologyContemporaryPeriodNode.filter(["1991-2000", "2001-2010", "2011-2020"]), ["1991-2000", "2001-2010", "2011-2020"]);
    
    let yr30LegacyClimatologyProperty = new FileProperty(climatologyLegacyPeriodNode.filter(["1978-2007"]), ["1978-2007"]);
    let yr30ContemporaryClimatologyProperty = new FileProperty(climatologyContemporaryPeriodNode.filter(["1991-2020"]), ["1991-2020"]);

    //package files
    let rainfallMapFile = new FileData(rainfallMapDisplayData, geotiffFtype, ["metadata"]);
    let legacyRainfallMapFile = new FileData(rainfallMapDisplayData, geotiffFtype, []);
    let temperatureMapFile = new FileData(temperatureMapDisplayData, geotiffFtype, ["metadata"]);
    let dsRainfallMapFile = new FileData(dsRainfallMapDisplayData, geotiffFtype, []);
    let dsRainfallMapChangeFile = new FileData(dsRainfallMapChangeDisplayData, geotiffFtype, []);
    let dsTemperatureMapFile = new FileData(dsTemperatureMapDisplayData, geotiffFtype, []);
    let dsTemperatureMapChangeFile = new FileData(dsTemperatureMapChangeDisplayData, geotiffFtype, []);
    let standardErrorMapFile = new FileData(standardErrorMapDisplayData, geotiffFtype, ["metadata"]);
    let anomalyFile = new FileData(anomalyDisplayData, geotiffFtype, ["metadata"]);
    let anomalyStandardErrorFile = new FileData(anomalyStandardErrorDisplayData, geotiffFtype, ["metadata"]);
    let metadataFile = new FileData(metadataDisplayData, txtFtype, []);
    let stationFile = new FileData(stationPartialDisplayData, csvFtype, []);
    let ndviMapFile = new FileData(ndviDisplayData, geotiffFtype, []);
    let rhMapFile = new FileData(rhMapDisplayData, geotiffFtype, ["metadata"]);
    let fireRiskMapFile = new FileData(fireRiskMapDisplayData, geotiffFtype, []);
    let legacyClimatologyRainfallMapFile = new FileData(climatologyRainfallMapDisplayData, geotiffFtype, ["metadata"]);
    let legacyClimatologyTemperatureMapFile = new FileData(climatologyTemperatureMapDisplayData, geotiffFtype, ["metadata"]);
    let contemporaryClimatologyRainfallMapFile = new FileData(climatologyRainfallMapDisplayData, geotiffFtype, []);
    let contemporaryClimatologyTemperatureMapFile = new FileData(climatologyTemperatureMapDisplayData, geotiffFtype, []);
    let legacyClimatologyMetadataFile = new FileData(metadataDisplayData, pdfFtype, []);

    //use if you want to add labeling to file groups in the future, unused for now
    // let griddedMapDisplayData = new DisplayData("Gridded mapped data files and metadata", "Map Data", "map_data");
    // let stationDisplayData = new DisplayData("Files containing station data", "Station Data", "station_data");
    let rainfallMonthMapFileGroup = new FileGroup(new DisplayData("", "", "a"), [rainfallMapFile, standardErrorMapFile, anomalyFile, anomalyStandardErrorFile, metadataFile], [allExtentProperty, rfMmUnitsProperty]);
    let rainfallMonthStationFileGroup = new FileGroup(new DisplayData("", "", "b"), [stationFile], [statewideProperty, rfMmUnitsProperty, fillPartialProperty]);
    let rainfallDayMapFileGroup = new FileGroup(new DisplayData("", "", "a"), [rainfallMapFile, standardErrorMapFile, anomalyFile, anomalyStandardErrorFile, metadataFile], [allExtentProperty, rfMmUnitsProperty]);
    let rainfallDayStationFileGroup = new FileGroup(new DisplayData("", "", "c"), [stationFile], [statewideProperty, rfMmUnitsProperty, fillProperty]);

    let legacyRainfallFileGroup = new FileGroup(new DisplayData("", "", "d"), [legacyRainfallMapFile], [statewideProperty, rfMmUnitsProperty])

    let temperatureMapFileGroup = new FileGroup(new DisplayData("", "", "e"), [temperatureMapFile, standardErrorMapFile, metadataFile], [allExtentProperty, tempCUnitsProperty]);
    let temperatureStationFileGroup = new FileGroup(new DisplayData("", "", "f"), [stationFile], [fillPartialProperty, statewideProperty, tempCUnitsProperty]);

    let dsRainfallStatisticalMapFileGroup = new FileGroup(new DisplayData("", "", "g"), [dsRainfallMapFile], [statewideProperty, rfAllUnitsProperty, dsPeriodStatisticalAllProperty]);
    let dsRainfallStatisticalChangeFileGroup = new FileGroup(new DisplayData("", "", "i"), [dsRainfallMapChangeFile], [statewideProperty, rfChangeUnitsProperty, dsPeriodStatisticalFutureProperty]);

    let dsRainfallDynamicalMapFileGroup = new FileGroup(new DisplayData("", "", "j"), [dsRainfallMapFile], [statewideProperty, rfAllUnitsProperty, dsPeriodDynamicalAllProperty]);
    let dsRainfallDynamicalChangeFileGroup = new FileGroup(new DisplayData("", "", "k"), [dsRainfallMapChangeFile], [statewideProperty, rfChangeUnitsProperty, dsPeriodDynamicalFutureProperty]);

    let dsTemperatureStatisticalMapFileGroup = new FileGroup(new DisplayData("", "", "l"), [dsTemperatureMapFile], [statewideProperty, tempAllUnitsProperty, dsPeriodStatisticalAllProperty]);
    let dsTemperatureStatisticalChangeFileGroup = new FileGroup(new DisplayData("", "", "n"), [dsTemperatureMapChangeFile], [statewideProperty, tempAllUnitsProperty, dsPeriodStatisticalFutureProperty]);

    let dsTemperatureDynamicalMapFileGroup = new FileGroup(new DisplayData("", "", "o"), [dsTemperatureMapFile], [statewideProperty, tempAllUnitsProperty, dsPeriodDynamicalAllProperty]);
    let dsTemperatureDynamicalChangeFileGroup = new FileGroup(new DisplayData("", "", "q"), [dsTemperatureMapChangeFile], [statewideProperty, tempAllUnitsProperty, dsPeriodDynamicalFutureProperty]);

    let ndviFileGroup = new FileGroup(new DisplayData("", "", "r"), [ndviMapFile], [statewideProperty, ndviPeriodProperty]);

    let rhDayMapFileGroup = new FileGroup(new DisplayData("", "", "s"), [rhMapFile, metadataFile], [allExtentProperty, percentUnitsProperty]);
    let rhDayStationFileGroup = new FileGroup(new DisplayData("", "", "t"), [stationFile], [statewideProperty, percentUnitsProperty, fillPartialProperty]);

    let fireRiskMapGroup = new FileGroup(new DisplayData("", "", "ae"), [fireRiskMapFile], [statewideProperty]);

    let contemporaryClimatologyRainfallMonthFileGroup = new FileGroup(new DisplayData("", "", "u"), [contemporaryClimatologyRainfallMapFile], [statewideProperty, monthContemporaryClimatologyProperty]);
    let contemporaryClimatologyRainfallDecadeFileGroup = new FileGroup(new DisplayData("", "", "v"), [contemporaryClimatologyRainfallMapFile], [statewideProperty, decadalClimatologyProperty]);
    let contemporaryClimatologyRainfall30yrFileGroup = new FileGroup(new DisplayData("", "", "w"), [contemporaryClimatologyRainfallMapFile], [statewideProperty, yr30ContemporaryClimatologyProperty]);
    let contemporaryClimatologyTemperatureMonthFileGroup = new FileGroup(new DisplayData("", "", "x"), [contemporaryClimatologyTemperatureMapFile], [statewideProperty, monthContemporaryClimatologyProperty]);
    let contemporaryClimatologyTemperatureDecadeFileGroup = new FileGroup(new DisplayData("", "", "y"), [contemporaryClimatologyTemperatureMapFile], [statewideProperty, decadalClimatologyProperty]);
    let contemporaryClimatologyTemperature30yrFileGroup = new FileGroup(new DisplayData("", "", "z"), [contemporaryClimatologyTemperatureMapFile], [statewideProperty, yr30ContemporaryClimatologyProperty]);
    let legacyClimatologyRainfallMonthFileGroup = new FileGroup(new DisplayData("", "", "aa"), [legacyClimatologyRainfallMapFile, legacyClimatologyMetadataFile], [allExtentProperty, monthLegacyClimatologyProperty]);
    let legacyClimatologyRainfall30yrFileGroup = new FileGroup(new DisplayData("", "", "ab"), [legacyClimatologyRainfallMapFile, legacyClimatologyMetadataFile], [allExtentProperty, yr30LegacyClimatologyProperty]);
    let legacyClimatologyTemperatureMonthFileGroup = new FileGroup(new DisplayData("", "", "ac"), [legacyClimatologyTemperatureMapFile, legacyClimatologyMetadataFile], [statewideProperty, monthLegacyClimatologyProperty]);
    let legacyClimatologyTemperature30yrFileGroup = new FileGroup(new DisplayData("", "", "ad"), [legacyClimatologyTemperatureMapFile, legacyClimatologyMetadataFile], [statewideProperty, yr30LegacyClimatologyProperty]);

    //note these can be combined with the vis timeseries stuff, just need to rework vis timeseries data to use this
    let rainfallMonthTimeseriesHandler = new TimeseriesHandler(date1990, lastMonth, monthPeriod, this.dateHandler);
    let temperatureRainfallDayTimeseriesHandler = new TimeseriesHandler(date1990, lastDay, dayPeriod, this.dateHandler);
    let legacyRainfallTimeseriesHandler = new TimeseriesHandler(date1920, date2012, monthPeriod, this.dateHandler);
    let temperatureMonthTimeseriesHandler = new TimeseriesHandler(date1990, lastMonth, monthPeriod, this.dateHandler);
    let ndviTimeseriesHandler = new TimeseriesHandler(dateNDVIStart, dateNDVIEnd, day16Period, this.dateHandler);
    let rhDayTimeseriesHandler = new TimeseriesHandler(dateRHStart, lastDay, dayPeriod, this.dateHandler);
    let fireRiskDayTimeseriesHandler = new TimeseriesHandler(dateFireRiskStart, dateFireRiskEnd, dayPeriod, this.dateHandler);

    //export items
    ////rainfall
    let rainfallMonthExportItem = new ExportDatasetItem([rainfallMonthMapFileGroup, rainfallMonthStationFileGroup], {
      period: "month"
    }, "Monthly Rainfall", rainfallMonthTimeseriesHandler);
    let rainfallDayExportItem = new ExportDatasetItem([rainfallDayMapFileGroup, rainfallDayStationFileGroup], {
      period: "day"
    }, "Daily Rainfall", temperatureRainfallDayTimeseriesHandler);
    ////legacy rainfall
    let legacyRainfallMonthExportItem = new ExportDatasetItem([legacyRainfallFileGroup], {
      period: "month"
    }, "Monthly Rainfall", legacyRainfallTimeseriesHandler);
    ////min temp
    let minTemperatureMonthExportItem = new ExportDatasetItem([temperatureMapFileGroup, temperatureStationFileGroup], {
      period: "month"
    }, "Monthly Minimum Temperature", temperatureMonthTimeseriesHandler);
    let minTemperatureDayExportItem = new ExportDatasetItem([temperatureMapFileGroup, temperatureStationFileGroup], {
      period: "day"
    }, "Daily Minimum Temperature", temperatureRainfallDayTimeseriesHandler);
    ////max temp
    let maxTemperatureMonthExportItem = new ExportDatasetItem([temperatureMapFileGroup, temperatureStationFileGroup], {
      period: "month"
    }, "Monthly Maximum Temperature", temperatureMonthTimeseriesHandler);
    let maxTemperatureDayExportItem = new ExportDatasetItem([temperatureMapFileGroup, temperatureStationFileGroup], {
      period: "day"
    }, "Daily Maximum Temperature", temperatureRainfallDayTimeseriesHandler);
    ////mean temp
    let meanTemperatureMonthExportItem = new ExportDatasetItem([temperatureMapFileGroup], {
      period: "month"
    }, "Monthly Mean Temperature", temperatureMonthTimeseriesHandler);
    let meanTemperatureDayExportItem = new ExportDatasetItem([temperatureMapFileGroup], {
      period: "day"
    }, "Daily Mean Temperature", temperatureRainfallDayTimeseriesHandler);
    //rh
    let rhDayExportItem = new ExportDatasetItem([rhDayMapFileGroup, rhDayStationFileGroup], {
      period: "day"
    }, "Daily Relative Humidity", rhDayTimeseriesHandler);
    //fire risk
    let fireRiskDayExportItem = new ExportDatasetItem([fireRiskMapGroup], {
      period: "day"
    }, "Daily Fire Risk", fireRiskDayTimeseriesHandler);
    //fireRiskMapGroup
    ////ds
    //////DS Rainfall

    let dsRainfallExportItems = [];
    for(let dsmItem of dsm) {
      let fileGroupData = [dsRainfallStatisticalMapFileGroup, dsRainfallStatisticalChangeFileGroup];
      if(dsmItem[0] == "dynamical") {
        fileGroupData = [dsRainfallDynamicalMapFileGroup, dsRainfallDynamicalChangeFileGroup]
      }
      for(let modelItem of model) {
        for(let seasonItem of season) {
          let datasetItem = new ExportDatasetItem(fileGroupData, {
            dsm: dsmItem[0],
            model: modelItem[0],
            season: <string>seasonItem[0]
          }, `${dsmItem[1]} ${seasonItem[1]} Rainfall (${modelItem[1]})`);
          dsRainfallExportItems.push(datasetItem);
        }
      }
    }


    //////DS Temperature
    let dsTemperatureStatisticalRcp45ExportItem = new ExportDatasetItem([dsTemperatureStatisticalMapFileGroup, dsTemperatureStatisticalChangeFileGroup], {
      dsm: "statistical",
      model: "rcp45"
    }, "Statistically Downscaled Temperature (RCP 4.5)");
    let dsTemperatureStatisticalRcp85ExportItem = new ExportDatasetItem([dsTemperatureStatisticalMapFileGroup, dsTemperatureStatisticalChangeFileGroup], {
      dsm: "statistical",
      model: "rcp85"
    }, "Statistically Downscaled Temperature (RCP 8.5)");
    let dsTemperatureDynamicalRcp45ExportItem = new ExportDatasetItem([dsTemperatureDynamicalMapFileGroup, dsTemperatureDynamicalChangeFileGroup], {
      dsm: "dynamical",
      model: "rcp45"
    }, "Dynamically Downscaled Temperature (RCP 4.5)");
    let dsTemperatureDynamicalRcp85ExportItem = new ExportDatasetItem([dsTemperatureDynamicalMapFileGroup, dsTemperatureDynamicalChangeFileGroup], {
      dsm: "dynamical",
      model: "rcp85"
    }, "Dynamically Downscaled Temperature (RCP 8.5)");
    //NDVI
    let ndviExportItem = new ExportDatasetItem([ndviFileGroup], {
      period: "16day"
    }, "NDVI", ndviTimeseriesHandler);

    //Climatologies
    let contemporaryClimatologyRainfallMonthExportItem = new ExportDatasetItem([contemporaryClimatologyRainfallMonthFileGroup], {
      mean_type: "mean_monthly"
    }, "Contemporary Mean Monthly Rainfall Climatologies");
    let contemporaryClimatologyRainfallDecadeExportItem = new ExportDatasetItem([contemporaryClimatologyRainfallDecadeFileGroup], {
      mean_type: "mean_annual_decadal"
    }, "Contemporary Mean Annual Decadal Rainfall Climatologies");
    let contemporaryClimatologyRainfall30yrExportItem = new ExportDatasetItem([contemporaryClimatologyRainfall30yrFileGroup], {
      mean_type: "mean_30yr_annual"
    }, "Contemporary Mean Annual 30 Year Rainfall Climatologies");



    let contemporaryClimatologyMeanTemperatureMonthExportItem = new ExportDatasetItem([contemporaryClimatologyTemperatureMonthFileGroup], {
      mean_type: "mean_monthly"
    }, "Contemporary Mean Monthly Mean Temperature Climatologies");
    let contemporaryClimatologyMeanTemperatureDecadeExportItem = new ExportDatasetItem([contemporaryClimatologyTemperatureDecadeFileGroup], {
      mean_type: "mean_annual_decadal"
    }, "Contemporary Mean Annual Decadal Mean Temperature Climatologies");
    let contemporaryClimatologyMeanTemperature30yrExportItem = new ExportDatasetItem([contemporaryClimatologyTemperature30yrFileGroup], {
      mean_type: "mean_30yr_annual"
    }, "Contemporary Mean Annual 30 Year Mean Temperature Climatologies");
    let contemporaryClimatologyMaxTemperatureMonthExportItem = new ExportDatasetItem([contemporaryClimatologyTemperatureMonthFileGroup], {
      mean_type: "mean_monthly"
    }, "Contemporary Mean Monthly Maximum Temperature Climatologies");
    let contemporaryClimatologyMaxTemperatureDecadeExportItem = new ExportDatasetItem([contemporaryClimatologyTemperatureDecadeFileGroup], {
      mean_type: "mean_annual_decadal"
    }, "Contemporary Mean Annual Decadal Maximum Temperature Climatologies");
    let contemporaryClimatologyMaxTemperature30yrExportItem = new ExportDatasetItem([contemporaryClimatologyTemperature30yrFileGroup], {
      mean_type: "mean_30yr_annual"
    }, "Contemporary Mean Annual 30 Year Maximum Temperature Climatologies");
    let contemporaryClimatologyMinTemperatureMonthExportItem = new ExportDatasetItem([contemporaryClimatologyTemperatureMonthFileGroup], {
      mean_type: "mean_monthly"
    }, "Contemporary Mean Monthly Minimum Temperature Climatologies");
    let contemporaryClimatologyMinTemperatureDecadeExportItem = new ExportDatasetItem([contemporaryClimatologyTemperatureDecadeFileGroup], {
      mean_type: "mean_annual_decadal"
    }, "Contemporary Mean Annual Decadal Minimum Temperature Climatologies");
    let contemporaryClimatologyMinTemperature30yrExportItem = new ExportDatasetItem([contemporaryClimatologyTemperature30yrFileGroup], {
      mean_type: "mean_30yr_annual"
    }, "Contemporary Mean Annual 30 Year Minimum Temperature Climatologies");




    let legacyClimatologyRainfallMonthExportItem = new ExportDatasetItem([legacyClimatologyRainfallMonthFileGroup], {
      mean_type: "mean_monthly"
    }, "Legacy Mean Monthly Rainfall Climatologies");
    let legacyClimatologyRainfall30yrExportItem = new ExportDatasetItem([legacyClimatologyRainfall30yrFileGroup], {
      mean_type: "mean_30yr_annual"
    }, "Legacy Mean Annual 30 Year Rainfall Climatologies");



    let legacyClimatologyMeanTemperatureMonthExportItem = new ExportDatasetItem([legacyClimatologyTemperatureMonthFileGroup], {
      mean_type: "mean_monthly"
    }, "Legacy Mean Monthly Mean Temperature Climatologies");
    let legacyClimatologyMeanTemperature30yrExportItem = new ExportDatasetItem([legacyClimatologyTemperature30yrFileGroup], {
      mean_type: "mean_30yr_annual"
    }, "Legacy Mean Annual 30 Year Mean Temperature Climatologies");
    let legacyClimatologyMaxTemperatureMonthExportItem = new ExportDatasetItem([legacyClimatologyTemperatureMonthFileGroup], {
      mean_type: "mean_monthly"
    }, "Legacy Mean Monthly Maximum Temperature Climatologies");
    let legacyClimatologyMaxTemperature30yrExportItem = new ExportDatasetItem([legacyClimatologyTemperature30yrFileGroup], {
      mean_type: "mean_30yr_annual"
    }, "Legacy Mean Annual 30 Year Maximum Temperature Climatologies");
    let legacyClimatologyMinTemperatureMonthExportItem = new ExportDatasetItem([legacyClimatologyTemperatureMonthFileGroup], {
      mean_type: "mean_monthly"
    }, "Legacy Mean Monthly Minimum Temperature Climatologies");
    let legacyClimatologyMinTemperature30yrExportItem = new ExportDatasetItem([legacyClimatologyTemperature30yrFileGroup], {
      mean_type: "mean_30yr_annual"
    }, "Legacy Mean Annual 30 Year Minimum Temperature Climatologies");


    ////Datasets
    let rainfallExportDataset = new Dataset<ExportDatasetItem>(rainfallDatasetDisplayData, {
      datatype: "rainfall",
      production: "new"
    }, periodOnlyFormData, [
      rainfallMonthExportItem,
      rainfallDayExportItem
    ]);
    let legacyRainfallExportDataset = new Dataset<ExportDatasetItem>(legacyRainfallDatasetDisplayData, {
      datatype: "rainfall",
      production: "legacy"
    }, periodOnlyFormData, [
      legacyRainfallMonthExportItem
    ]);
    let maxTemperatureExportDataset = new Dataset<ExportDatasetItem>(maxTemperatureDatasetDisplayData, {
      datatype: "temperature",
      aggregation: "max"
    }, periodOnlyFormData, [
      maxTemperatureMonthExportItem,
      maxTemperatureDayExportItem
    ]);
    let minTemperatureExportDataset = new Dataset<ExportDatasetItem>(minTemperatureDatasetDisplayData, {
      datatype: "temperature",
      aggregation: "min"
    }, periodOnlyFormData, [
      minTemperatureMonthExportItem,
      minTemperatureDayExportItem
    ]);
    let meanTemperatureExportDataset = new Dataset<ExportDatasetItem>(meanTemperatureDatasetDisplayData, {
      datatype: "temperature",
      aggregation: "mean"
    }, periodOnlyFormData, [
      meanTemperatureDayExportItem,
      meanTemperatureMonthExportItem
    ]);
    let dsRainfallExportDataset = new Dataset<ExportDatasetItem>(dsRainfallDatasetDisplayData, {
      datatype: "downscaling_rainfall"
    }, dsRainfallFormDataExport, dsRainfallExportItems);
    let dsTemperatureExportDataset = new Dataset<ExportDatasetItem>(dsTemperatureDatasetDisplayData, {
      datatype: "downscaling_temperature"
    }, dsTemperatureFormDataExport, [
      dsTemperatureStatisticalRcp45ExportItem,
      dsTemperatureStatisticalRcp85ExportItem,
      dsTemperatureDynamicalRcp45ExportItem,
      dsTemperatureDynamicalRcp85ExportItem
    ]);
    let ndviExportDataset = new Dataset<ExportDatasetItem>(ndviDatasetDisplayData, {
      datatype: "ndvi"
    }, ndviFormData, [
      ndviExportItem
    ]);
    let rhExportDataset = new Dataset<ExportDatasetItem>(rhDatasetDisplayData, {
      datatype: "relative_humidity"
    }, periodOnlyFormData, [
      rhDayExportItem
    ]);
    let fireRiskExportDataset = new Dataset<ExportDatasetItem>(fireRiskDatasetDisplayData, {
      datatype: "fire_risk"
    }, periodOnlyFormData, [
      fireRiskDayExportItem
    ]);

    let contemporaryClimatologyRainfallExportDataset = new Dataset<ExportDatasetItem>(contemporaryRainfallClimatologyDatasetDisplayData, {
      datatype: "contemporary_climatology",
      variable: "rainfall"
    }, contemporaryClimatologyExportFormData, [
      contemporaryClimatologyRainfallMonthExportItem,
      contemporaryClimatologyRainfallDecadeExportItem,
      contemporaryClimatologyRainfall30yrExportItem
    ]);
    let contemporaryClimatologyMeanTemperatureExportDataset = new Dataset<ExportDatasetItem>(contemporaryMeanTemperatureClimatologyDatasetDisplayData, {
      datatype: "contemporary_climatology",
      variable: "air_temperature",
      aggregation: "mean"
    }, contemporaryClimatologyExportFormData, [
      contemporaryClimatologyMeanTemperatureMonthExportItem,
      contemporaryClimatologyMeanTemperatureDecadeExportItem,
      contemporaryClimatologyMeanTemperature30yrExportItem
    ]);
    let contemporaryClimatologyMaxTemperatureExportDataset = new Dataset<ExportDatasetItem>(contemporaryMaxTemperatureClimatologyDatasetDisplayData, {
      datatype: "contemporary_climatology",
      variable: "air_temperature",
      aggregation: "max"
    }, contemporaryClimatologyExportFormData, [
      contemporaryClimatologyMaxTemperatureMonthExportItem,
      contemporaryClimatologyMaxTemperatureDecadeExportItem,
      contemporaryClimatologyMaxTemperature30yrExportItem
    ]);
    let contemporaryClimatologyMinTemperatureExportDataset = new Dataset<ExportDatasetItem>(contemporaryMinTemperatureClimatologyDatasetDisplayData, {
      datatype: "contemporary_climatology",
      variable: "air_temperature",
      aggregation: "min"
    }, contemporaryClimatologyExportFormData, [
      contemporaryClimatologyMinTemperatureMonthExportItem,
      contemporaryClimatologyMinTemperatureDecadeExportItem,
      contemporaryClimatologyMinTemperature30yrExportItem
    ]);
    let legacyClimatologyRainfallExportDataset = new Dataset<ExportDatasetItem>(legacyRainfallClimatologyDatasetDisplayData, {
      datatype: "legacy_climatology",
      variable: "rainfall"
    }, legacyClimatologyExportFormData, [
      legacyClimatologyRainfallMonthExportItem,
      legacyClimatologyRainfall30yrExportItem
    ]);
    let legacyClimatologyMeanTemperatureExportDataset = new Dataset<ExportDatasetItem>(legacyMeanTemperatureClimatologyDatasetDisplayData, {
      datatype: "legacy_climatology",
      variable: "air_temperature",
      aggregation: "mean"
    }, legacyClimatologyExportFormData, [
      legacyClimatologyMeanTemperatureMonthExportItem,
      legacyClimatologyMeanTemperature30yrExportItem
    ]);
    let legacyClimatologyMaxTemperatureExportDataset = new Dataset<ExportDatasetItem>(legacyMaxTemperatureClimatologyDatasetDisplayData, {
      datatype: "legacy_climatology",
      variable: "air_temperature",
      aggregation: "max"
    }, legacyClimatologyExportFormData, [
      legacyClimatologyMaxTemperatureMonthExportItem,
      legacyClimatologyMaxTemperature30yrExportItem
    ]);
    let legacyClimatologyMinTemperatureExportDataset = new Dataset<ExportDatasetItem>(legacyMinTemperatureClimatologyDatasetDisplayData, {
      datatype: "legacy_climatology",
      variable: "air_temperature",
      aggregation: "min"
    }, legacyClimatologyExportFormData, [
      legacyClimatologyMinTemperatureMonthExportItem,
      legacyClimatologyMinTemperature30yrExportItem
    ]);



    ///////////////////////////////////////////////////////////////////
    ///////////// Create Dataset Groups and Form Managers /////////////
    ///////////////////////////////////////////////////////////////////

    let historicalRainfallGrouperDisplayData = new DisplayData("Datasets using empirical rainfall data.", "Historical Rainfall", "historical_rainfall");
    let historicalTemperatureGrouperDisplayData = new DisplayData("Datasets using empirical temperature data", "Historical Temperature", "historical_temperature");
    let dsGrouperDisplayData = new DisplayData("Future climate projections using downscaling prediction methods.", "Future Climate Projections", "downscaled");
    let contemporaryClimatologyGrouperDisplayData = new DisplayData("Contemporary climatologies.", "Contemporary Climatology", "contemporary_climatology");
    let legacyClimatologyGrouperDisplayData = new DisplayData("Legacy Climatologies.", "Legacy Climatology", "legacy_climatology");
    let datasetFormDisplayData = new DisplayData("Select the type of data you would like to view. Hover over an option for a description of the dataset.", "Dataset", "dataset");
    //vis dataset groups
    let visDatasets = [rainfallVisDataset, legacyRainfallVisDataset, maxTemperatureVisDataset, minTemperatureVisDataset, meanTemperatureVisDataset, dsRainfallVisDataset, dsTemperatureVisDataset, ndviVisDataset, rhVisDataset, /*fireRiskVisDataset,*/ contemporaryRainfallClimatologyVisDataset, legacyRainfallClimatologyVisDataset, contemporaryMeanTemperatureClimatologyVisDataset, contemporaryMaxTemperatureClimatologyVisDataset, contemporaryMinTemperatureClimatologyVisDataset, legacyMeanTemperatureClimatologyVisDataset, legacyMaxTemperatureClimatologyVisDataset, legacyMinTemperatureClimatologyVisDataset];
    let visDatasetSingles: Dataset<VisDatasetItem>[] = [ndviVisDataset, rhVisDataset/*, fireRiskVisDataset*/];
    let visDatasetGroupers: DatasetSelectorGroup[] = [
      new DatasetSelectorGroup(historicalRainfallGrouperDisplayData, [rainfallVisDataset, legacyRainfallVisDataset]),
      new DatasetSelectorGroup(historicalTemperatureGrouperDisplayData, [maxTemperatureVisDataset, minTemperatureVisDataset, meanTemperatureVisDataset]),
      new DatasetSelectorGroup(dsGrouperDisplayData, [dsRainfallVisDataset, dsTemperatureVisDataset]),
      new DatasetSelectorGroup(contemporaryClimatologyGrouperDisplayData, [contemporaryRainfallClimatologyVisDataset, contemporaryMeanTemperatureClimatologyVisDataset, contemporaryMaxTemperatureClimatologyVisDataset, contemporaryMinTemperatureClimatologyVisDataset]),
      new DatasetSelectorGroup(legacyClimatologyGrouperDisplayData, [legacyRainfallClimatologyVisDataset, legacyMeanTemperatureClimatologyVisDataset, legacyMaxTemperatureClimatologyVisDataset, legacyMinTemperatureClimatologyVisDataset])
    ];
    let visDatasetFormData = new DatasetFormData(datasetFormDisplayData, visDatasetSingles, visDatasetGroupers);

    //export dataset groups
    let exportDatasets = [rainfallExportDataset, legacyRainfallExportDataset, maxTemperatureExportDataset, minTemperatureExportDataset, meanTemperatureExportDataset, dsRainfallExportDataset, dsTemperatureExportDataset, ndviExportDataset, rhExportDataset, /*fireRiskExportDataset,*/ contemporaryClimatologyRainfallExportDataset, legacyClimatologyRainfallExportDataset, contemporaryClimatologyMeanTemperatureExportDataset, contemporaryClimatologyMaxTemperatureExportDataset, contemporaryClimatologyMinTemperatureExportDataset, legacyClimatologyMeanTemperatureExportDataset, legacyClimatologyMaxTemperatureExportDataset, legacyClimatologyMinTemperatureExportDataset];
    let exportDatasetSingles: Dataset<ExportDatasetItem>[] = [ndviExportDataset, rhExportDataset, /*fireRiskExportDataset*/];
    let exportDatasetGroupers: DatasetSelectorGroup[] = [
      new DatasetSelectorGroup(historicalRainfallGrouperDisplayData, [rainfallExportDataset, legacyRainfallExportDataset]),
      new DatasetSelectorGroup(historicalTemperatureGrouperDisplayData, [maxTemperatureExportDataset, minTemperatureExportDataset, meanTemperatureExportDataset]),
      new DatasetSelectorGroup(dsGrouperDisplayData, [dsRainfallExportDataset, dsTemperatureExportDataset]),
      new DatasetSelectorGroup(contemporaryClimatologyGrouperDisplayData, [contemporaryClimatologyRainfallExportDataset, contemporaryClimatologyMeanTemperatureExportDataset, contemporaryClimatologyMaxTemperatureExportDataset, contemporaryClimatologyMinTemperatureExportDataset]),
      new DatasetSelectorGroup(legacyClimatologyGrouperDisplayData, [legacyClimatologyRainfallExportDataset, legacyClimatologyMeanTemperatureExportDataset, legacyClimatologyMaxTemperatureExportDataset, legacyClimatologyMinTemperatureExportDataset])
    ];
    let exportDatasetFormData = new DatasetFormData(datasetFormDisplayData, exportDatasetSingles, exportDatasetGroupers);

    //default values for each node
    let defaultVisState = {
      datatype: "rainfall",
      period: "month",
      fill: "partial",
      dsm: "statistical",
      model: "rcp45",
      season: "annual"
    };
    let defaultExportState = {
      datatype: "rainfall",
      period: "month",
      dsm: "statistical",
      model: "rcp45",
      season: "annual"
    };
    //create form managers
    this._visFormManager = new FormManager(visDatasets, visDatasetFormData, defaultVisState);
    this._exportFormManager = new FormManager(exportDatasets, exportDatasetFormData, defaultExportState);
  }

  get visFormManager(): FormManager<VisDatasetItem> {
    return this._visFormManager;
  }

  get exportFormManager(): FormManager<ExportDatasetItem> {
    return this._exportFormManager;
  }
}


export type ActiveFormData<T extends DatasetItem> = {
  datasetFormData: DatasetFormData,
  datasetItem: T,
  values: StringMap
}


export class DatasetFormData {
  private _displayData: DisplayData;
  private _datasetValues: FormValue[];
  private _groupers: DatasetSelectorGroup[];

  constructor(displayData: DisplayData, datasets: Dataset<DatasetItem>[], datasetGroups: DatasetSelectorGroup[]) {
    this._displayData = displayData;
    this._datasetValues = datasets.map((dataset: Dataset<DatasetItem>) => {
      return new FormValue(dataset.displayData, dataset.paramData, [true, true]);
    });
    this._groupers = datasetGroups;
  }

  get description(): string {
    return this._displayData.description;
  }

  get label(): string {
    return this._displayData.label;
  }

  get tag(): string {
    return this._displayData.tag;
  }

  get displayData(): DisplayData {
    return this._displayData;
  }

  get datasetValues(): FormValue[] {
    return this._datasetValues;
  }

  get datasetGroups(): DatasetSelectorGroup[] {
    return this._groupers;
  }
}

export class DatasetSelectorGroup {
  private _displayData: DisplayData;
  private _values: DisplayData[];

  constructor(displayData: DisplayData, datasets: Dataset<DatasetItem>[]) {
    this._values = datasets.map((dataset: Dataset<DatasetItem>) => {
      return dataset.displayData;
    });
    this._displayData = displayData;
  }

  get description(): string {
    return this._displayData.description;
  }

  get label(): string {
    return this._displayData.label;
  }

  get tag(): string {
    return this._displayData.tag;
  }

  get displayData(): DisplayData {
    return this._displayData;
  }

  get values(): DisplayData[] {
    return this._values;
  }
}

export class FormData {
  private _default: FormNode[];
  private _categorized: FormCategory[];

  constructor(defaultNodes: FormNode[], categorizedNodes: FormCategory[]) {
    this._default = defaultNodes;
    this._categorized = categorizedNodes;
  }

  get default(): FormNode[] {
    return this._default;
  }

  get categorized(): FormCategory[] {
    return this._categorized;
  }

  private filterNodes(values: any, nodes: FormNode[]) {
    return nodes.map((node: FormNode) => {
      let tag = node.tag;
      let valueTags = values[tag];
      if(!Array.isArray(valueTags)) {
        valueTags = [valueTags];
      }
      return node.filter(valueTags);
    });
  }

  public filter(values: any): FormData {
    let filteredDefault = this.filterNodes(values, this._default);
    let filteredCategorized = this._categorized.map((category: FormCategory) => {
      let nodes = this.filterNodes(values, category.nodes);
      return new FormCategory(category.displayData, nodes);
    });
    return new FormData(filteredDefault, filteredCategorized);
  }

  public flatten(): FormNode[] {
    let nodes = [...this._default];
    for(let category of this._categorized) {
      nodes = nodes.concat(category.nodes);
    }
    return nodes;
  }
}


//each dataset has a specific set of fields, define the entire set of fields and values, specific items can have subsets that are valid for it (all descriptions etc must be the same)
//dataset fields can be bound together by using the same tags
//each individual item will just have a tag map
//what properties are dataset specific?
class Dataset<T extends DatasetItem> {
  private _displayData: DisplayData;
  private _formData: FormData;
  private _fields: string[];
  private _itemMap: any;
  private _paramData: StringMap;

  constructor(displayData: DisplayData, paramData: StringMap, formData: FormData, items: T[]) {
    this._fields = [];
    for(let node of formData.default) {
      this._fields.push(node.tag);
    }
    for(let category of formData.categorized) {
      for(let node of category.nodes) {
        this._fields.push(node.tag);
      }
    }
    this._formData = formData;
    this._displayData = displayData;
    this._paramData = paramData;
    this._itemMap = {};
    for(let item of items) {
      this.addItem(item);
    }
  }

  private addItem(item: T) {
    item.dataset = this;
    let values = item.values;
    let tree = this._itemMap;
    let i: number;
    for(i = 0; i < this._fields.length - 1; i++) {
      let field = this._fields[i];
      let value = values[field];
      let next = tree[value];
      if(next === undefined) {
        next = {};
        tree[value] = next;
      }
      tree = next;
    }
    //leaf node should ne the dataset item
    let field = this._fields[i];
    let value = values[field];
    tree[value] = item;
  }

  get formData(): FormData {
    return this._formData;
  }

  get description(): string {
    return this._displayData.description;
  }

  get label(): string {
    return this._displayData.label;
  }

  get tag(): string {
    return this._displayData.tag;
  }

  get displayData(): DisplayData {
    return this._displayData;
  }

  get paramData(): StringMap {
    return this._paramData;
  }

  public getStateData(state: StringMap): StateData<T> {
    //retrieve corrected state, the dataset item associated with it, and form data
    let correctedState = Object.assign({}, state);
    let validValues = {};
    let tree = this._itemMap;
    for(let field of this._fields) {
      //get form data (valid values for subtree)
      let fieldValues = Object.keys(tree);
      validValues[field] = fieldValues;

      let stateValue = state[field];
      let next = tree[stateValue];
      if(next === undefined) {
        let validStateValue = fieldValues[0];
        correctedState[field] = validStateValue;
        next = tree[validStateValue];
      }
      tree = next;
    }
    //leaf node is the dataset item
    let datasetItem: T = tree;
    //check if form info cached in item
    if(datasetItem.formData === null) {
      let filteredFormData = this.formData.filter(validValues);
      //cache form data in the item so don't have to recompute if same combination selected, can use this field to retrieve form data in caller
      datasetItem.formData = filteredFormData;
    }

    //process form data into FormData object by filtering values
    return {
      //leaf node is the dataset item
      item: datasetItem,
      state: correctedState
    }
  }
}

type StateData<T extends DatasetItem> = {
  item: T,
  state: StringMap
}


export abstract class DatasetItem {
  private _fieldData: {[tag: string]: DisplayData};
  private _rasterParams: StringMap;
  private _stationParams: StringMap;
  private _baseParams: StringMap;
  private _values: StringMap;
  private _formData: FormData;
  private _label: string;

  constructor(values: StringMap, label: string) {
    this._values = values;
    this._formData = null;
    this._label = label;
  }

  get formData(): FormData {
    return this._formData;
  }

  set formData(formData: FormData) {
    this._formData = formData;
  }

  get values(): StringMap {
    return this._values;
  }

  get rasterParams(): StringMap {
    return this._rasterParams;
  }

  get stationParams(): StringMap {
    return this._stationParams;
  }

  get baseParams(): StringMap {
    return this._baseParams;
  }

  get label(): string {
    return this._label;
  }

  set dataset(dataset: Dataset<DatasetItem>) {
    this._baseParams = Object.assign({}, dataset.paramData);
    this._rasterParams = Object.assign({}, dataset.paramData);
    this._stationParams = Object.assign({}, dataset.paramData);
    this._fieldData = {
      dataset: dataset.displayData
    };
    dataset.formData.default.forEach(this._setNodeData.bind(this));
    for(let category of dataset.formData.categorized) {
      category.nodes.forEach(this._setNodeData.bind(this));
    }
  }

  private _setNodeData(node: FormNode) {
    let valueTag = this.values[node.tag];
    //get value data for item that matches the tag for this item
    let valueData = node.values.find((value: FormValue) => {
      return value.tag == valueTag;
    });
    this._baseParams = Object.assign(this._baseParams, valueData.paramData);
    if(valueData.applicability[0]) {
      this._rasterParams = Object.assign(this._rasterParams, valueData.paramData);
    }
    if(valueData.applicability[1]) {
      this._stationParams = Object.assign(this._stationParams, valueData.paramData);
    }
    this._fieldData[node.tag] = valueData.displayData;
  }

  getFieldLabel(field: string): string {
    return this._fieldData[field].label;
  }

  getFieldDescription(field: string): string {
    return this._fieldData[field].description;
  }
}

export class VisDatasetItem extends DatasetItem {
  private _includeStations: boolean;
  private _includeRaster: boolean;
  private _units: string;
  private _unitsShort: string;
  private _dataRange: [number, number];
  private _rangeAbsolute: [boolean, boolean];
  //when select date options should emit param data for date
  private _focusManager: FocusManager<any>;
  private _reverseColors: boolean;
  private _datatype: string;
  private _timeseriesData: TimeseriesData[];
  private _optionData: OptionData;

  constructor(includeStations: boolean, includeRaster: boolean, units: string, unitsShort: string, datatype: string, label: string, dataRange: [number, number], rangeAbsolute: [boolean, boolean], focusManager: FocusManager<any>, timeseriesData: TimeseriesData[], reverseColors: boolean, values: StringMap, optionData?: OptionData) {
    super(values, label);
    this._includeRaster = includeRaster;
    this._includeStations = includeStations;
    this._units = units;
    this._unitsShort = unitsShort;
    this._dataRange = dataRange;
    this._rangeAbsolute = rangeAbsolute;
    this._reverseColors = reverseColors;
    this._datatype = datatype;
    this._focusManager = focusManager;
    this._timeseriesData = timeseriesData;
    this._optionData = optionData;
  }

  get optionData(): OptionData {
    return this._optionData;
  }

  get dataypeLabel(): string {
    let label = this._datatype;
    if(this.displayStyle !== "standard") {
      label += " Change";
    }
    return label;
  }

  get datatype(): string {
    return this._datatype;
  }

  get includeStations(): boolean {
    return this._includeStations;
  }

  get includeRaster(): boolean {
    return this._includeRaster;
  }

  get units(): string {
    return this._optionData?.unitData.unit || this._units;
  }

  get unitsShort(): string {
    return this._optionData?.unitData.short || this._unitsShort;
  }

  get dataRange(): [number, number] {
    return this._optionData?.unitData.range || this._dataRange;
  }

  get displayStyle(): DisplayStyle {
    return this._optionData?.displayStyle || "standard";
  }

  get rangeAbsolute(): [boolean, boolean] {
    return this._rangeAbsolute;
  }

  get reverseColors(): boolean {
    return this._reverseColors;
  }

  get focusManager(): FocusManager<any> {
    return this._focusManager;
  }

  get coverageLabel(): string {
    return this.focusManager.coverageLabel;
  }

  get timeseriesData(): TimeseriesData[] {
    return this._timeseriesData;
  }
}

export type UnitOfTime = "year" | "month" | "day" | "hour" | "minute" | "second";

export class FocusData<T> {
  private _paramData: StringMap;
  private _label: string;
  private _data: T;
  private _type: string

  constructor(type: string, label: string, paramData: StringMap, data: T) {
    this._label = label;
    this._paramData = paramData;
    this._data = data;
    this._type = type;
  }

  get type(): string {
    return this._type;
  }

  get label(): string {
    return this._label;
  }

  get data(): T {
    return this._data;
  }

  get paramData(): StringMap {
    return this._paramData;
  }
}

export abstract class FocusManager<T> {
  private _type: string;
  private _coverageLabel: string;
  private _defaultValue: T;

  constructor(type: string, coverageLabel: string, defaultValue: T) {
    this._coverageLabel = coverageLabel;
    this._type = type;
    this._defaultValue = defaultValue;
  }

  get type(): string {
    return this._type;
  }

  abstract getFocusData(value: T): FocusData<T>;

  get coverageLabel(): string {
    return this._coverageLabel;
  };

  get defaultValue(): T {
    return this._defaultValue;
  }
}

export class Form {
  node: FormNode
}

export interface ViewDataMap {
  [view: string]: ViewData
}

export interface ViewData {
  displayStyle: DisplayStyle,
  units: {
    [unit: string]: UnitData
  }
}
export interface UnitData {
  unit: string
  short: string,
  range: [number, number]
}


export class OptionData {
  private _typeNode: FormNode;
  private unitMap: {[type: string]: FormNode};
  private _viewDataMap: ViewDataMap;
  private _type: string;
  private _unit: string;

  //valid combos of options, use to create stripped down nodes
  constructor(typeNode: FormNode, unitMap: {[type: string]: FormNode}, viewDataMap: ViewDataMap, defaultType: string, defaultUnit: string) {
    this._typeNode = typeNode;
    this.unitMap = unitMap;
    this._viewDataMap = viewDataMap;
    this._type = defaultType;
    this._unit = defaultUnit;
  }

  public getUnitNode(type: string) {
    return this.unitMap[type];
  }

  get unitNode(): FormNode {
    return this.getUnitNode(this._type);
  }

  get displayStyle() {
    return this._viewDataMap[this._type].displayStyle;
  }

  get unitData() {
    return this._viewDataMap[this._type].units[this.unit];
  }
  get typeNode(): FormNode {
    return this._typeNode;
  }

  get type(): string {
    return this._type;
  }

  get unit(): string {
    return this._type == "percent"? "percent" : this._unit;
  }

  set type(type: string) {
    this._type = type;
  }

  set unit(unit: string) {
    this._unit = unit;
  }

  get paramData(): StringMap {
    let valueParamData = this._typeNode.values.filter((value: FormValue) => {
      return value.tag == this._type;
    })[0].paramData;
    let unitParamData = {};
    if(this.unitNode) {
      unitParamData = this.unitNode.values.filter((value: FormValue) => {
        return value.tag == this._unit;
      })[0].paramData;
    }

    return {
      ...valueParamData,
      ...unitParamData
    };
  }
}


//should remove
export class TimeSelectorData extends FocusManager<FormValue> {
  private _formData: FormNode;

  constructor(formData: FormNode, defaultValue: FormValue) {
    super("selector", undefined, defaultValue);
    this._formData = formData;
  }

  get formData(): FormNode {
    return this._formData;
  }

  getFocusData(value: FormValue): FocusData<FormValue> {
    return new FocusData(this.type, undefined, value.paramData, value);
  }
}

export class PeriodData {
  private _unit: UnitOfTime;
  private _interval: number;
  private _tag: string;

  constructor(unit: UnitOfTime, interval: number, tag: string) {
    this._unit = unit;
    this._interval = interval;
    this._tag = tag;
  }

  get unit(): UnitOfTime {
    return this._unit;
  }

  get interval(): number {
    return this._interval;
  }

  get tag(): string {
    return this._tag;
  }
}


export class TimeseriesHandler {
  private _start: Moment;
  private _end: Moment;
  private _period: PeriodData;
  private _dateHandler: DateManagerService;
  private _coverageLabel: string;

  constructor(start: Moment, end: Moment, period: PeriodData, dateHandler: DateManagerService) {
    this._coverageLabel = `${dateHandler.dateToString(start, period.unit, true)} - ${dateHandler.dateToString(end, period.unit, true)}`;
    this._start = start;
    this._end = end;
    this._period = period;
    this._dateHandler = dateHandler;
  }

  getLabel(date: Moment): string {
    return `${this._dateHandler.dateToString(date, this._period.unit, true)}`
  }

  addInterval(time: Moment, n: number = 1): Moment {
    let result = this.roundToInterval(time);
    result.add(n * this.interval, this.unit);
    result = this.lockToRange(result);
    return result;
  }

  roundToInterval(time: Moment) {
    let base = this._start.clone();
    let timeClone = time.clone();
    let intervalDiff = timeClone.diff(base, this.unit) / this.interval;
    let roundedDiff = Math.round(intervalDiff) * this.interval;
    base.add(roundedDiff, this.unit);
    base = this.lockToRange(base);
    return base;
  }

  lockToRange(time: Moment) {
    let res: Moment = time;
    if(time.isBefore(this._start)) {
      res = this._start.clone();
    }
    else if(time.isAfter(this._end)) {
      res = this._end.clone();
    }
    return res;
  }

  get coverageLabel(): string {
    return this._coverageLabel;
  }

  get start(): Moment {
    return this._start;
  }

  get end(): Moment {
    return this._end;
  }

  get unit(): UnitOfTime {
    return this._period.unit;
  }

  get interval(): number {
    return this._period.interval;
  }

  get period(): PeriodData {
    return this._period;
  }
}



//CUSTOM HANDLER IS A TEMPORARY PATCH FOR NDVI
//should either use some kind of timeseries generator function or preferrably an API call to get next/previous/rounded dates based on actual available data
//API call also allows for non-specific/variable periods
export class TimeseriesData extends FocusManager<Moment> {
  private _start: Moment;
  private _end: Moment;
  private _period: PeriodData;
  private _nextPeriod: PeriodData;
  private _dateHandler: DateManagerService;

  constructor(start: Moment, end: Moment, period: PeriodData, nextPeriod: PeriodData, dateHandler: DateManagerService, defaultDate: Moment) {
    let coverageLabel = `${dateHandler.dateToString(start, period.unit, true)} - ${dateHandler.dateToString(end, period.unit, true)}`;
    super("timeseries", coverageLabel, defaultDate);
    this._start = start;
    this._end = end;
    this._period = period;
    this._nextPeriod = nextPeriod;
    this._dateHandler = dateHandler;
  }

  expandDates(start: Moment, end: Moment) {
    let date = this.roundToInterval(start);
    end = this.roundToInterval(end);
    let dates = [];
    while(date.isSameOrBefore(end)) {
      dates.push(date.clone());
      date = this.addInterval(date, 1, false);
    }
    return dates;
  }

  addInterval(time: Moment, n: number = 1, lock: boolean = true): Moment {
    let result = this.roundToInterval(time);
    result.add(n * this.interval, this.unit);
    if(lock) {
      result = this.lockToRange(result);
    }
    return result;
  }

  roundToInterval(time: Moment) {
    let base = this._start.clone();
    let timeClone = time.clone();
    let intervalDiff = timeClone.diff(base, this.unit) / this.interval;
    let roundedDiff = Math.round(intervalDiff) * this.interval;
    base.add(roundedDiff, this.unit);
    base = this.lockToRange(base);
    return base;
  }

  lockToRange(time: Moment) {
    let res: Moment = time;
    if(time.isBefore(this._start)) {
      res = this._start.clone();
    }
    else if(time.isAfter(this._end)) {
      res = this._end.clone();
    }
    return res;
  }

  getFocusData(time: Moment): FocusData<Moment> {
    return new FocusData(this.type, this._dateHandler.dateToString(time, this.unit, true), {date: this._dateHandler.dateToString(time, this.unit, false)}, time);
  }

  get start(): Moment {
    return this._start;
  }

  get end(): Moment {
    return this._end;
  }

  get unit(): UnitOfTime {
    return this._period.unit;
  }

  get interval(): number {
    return this._period.interval;
  }

  get period(): PeriodData {
    return this._period;
  }

  get nextPeriod(): PeriodData {
    return this._nextPeriod;
  }
}

class NDVITimeseriesData extends TimeseriesData {
  addInterval(time: Moment, n: number = 1, lock: boolean = true): Moment {
    let result = this.roundToInterval(time);
    //if going forward, relatively simple, reset to beginning of year if going over year boundary
    if(n > 0) {
      for(let i = 0; i < n; i++) {
        let year = result.year();
        result.add(this.interval, this.unit);
        if(year != result.year()) {
          result.startOf("year");
        }
      }
    }
    //if going backwards need to get last date from previous year, just use rounding hack since this is exclusively for ndvi
    else {
      for(let i = 0; i > n; i--) {
        let year = result.year();
        result.subtract(this.interval, this.unit);
        let newYear = result.year()
        if(year != newYear) {
          //should always end on 12/19 or 12/18 if leap year, so as a quick hack just go to 12/19 and round
          result = this.roundToInterval(moment(`${newYear}-12-19`));
        }
      }
    }
    if(lock) {
      result = this.lockToRange(result);
    }
    return result;
  }

  roundToInterval(time: Moment) {
    //start from beginning of year
    let base = time.clone().startOf("year");
    let timeClone = time.clone();
    let intervalDiff = timeClone.diff(base, this.unit) / this.interval;
    let roundedDiff = Math.round(intervalDiff) * this.interval;
    base.add(roundedDiff, this.unit);
    base = this.lockToRange(base);
    return base;
  }
}


export class FormCategory {
  private _displayData: DisplayData;
  private _nodes: FormNode[];

  constructor(displayData: DisplayData, nodes: FormNode[]) {
    this._displayData = displayData;
    this._nodes = nodes;
  }

  get description(): string {
    return this._displayData.description;
  }

  get label(): string {
    return this._displayData.label;
  }

  get tag(): string {
    return this._displayData.tag;
  }

  get displayData(): DisplayData {
    return this._displayData;
  }

  get nodes(): FormNode[] {
    return this._nodes;
  }
}

//note use "true" and "false" as special value tags for toggles
export class FormNode {
  private _displayData: DisplayData
  private _values: FormValue[];
  private _defaultValue: FormValue;

  constructor(displayData: DisplayData, values: FormValue[], defaultValue: FormValue = null) {
    this._displayData = displayData;
    this._values = values;
    this._defaultValue = defaultValue;
  }

  get defaultValue(): FormValue {
    return this._defaultValue;
  }

  get description(): string {
    return this._displayData.description;
  }

  get label(): string {
    return this._displayData.label;
  }

  get tag(): string {
    return this._displayData.tag;
  }

  get displayData(): DisplayData {
    return this._displayData;
  }

  get values(): FormValue[] {
    return this._values;
  }

  public filter(valueTags: string[], defaultValue?: string): FormNode {
    let tagSet = new Set(valueTags);
    if(defaultValue === undefined && this._defaultValue !== null) {
      defaultValue = this._defaultValue.tag;
    }
    let newDefault = null;
    let filteredValues = this._values.filter((value: FormValue) => {
      if(defaultValue !== undefined && value.tag == defaultValue) {
        newDefault = value;
      }
      return tagSet.has(value.tag);
    });
    return new FormNode(this._displayData, filteredValues, newDefault);
  }
}

export class FormValue {
  private _displayData: DisplayData;
  private _paramData: StringMap;
  private _applicability: [boolean, boolean];

  constructor(displayData: DisplayData, paramData: StringMap, applicability: [boolean, boolean]) {
    this._displayData = displayData;
    this._paramData = paramData;
    this._applicability = applicability;
  }

  get description(): string {
    return this._displayData.description;
  }

  get label(): string {
    return this._displayData.label;
  }

  get tag(): string {
    return this._displayData.tag;
  }

  get displayData(): DisplayData {
    return this._displayData;
  }

  get paramData(): StringMap {
    return this._paramData;
  }

  get applicability(): [boolean, boolean] {
    return this._applicability
  }
}

export class DisplayData {
  private _description: string;
  private _label: string;
  private _tag: string;

  constructor(description: string, label: string, tag: string) {
    this._description = description;
    this._label = label;
    this._tag = tag;
  }

  get description(): string {
    return this._description;
  }

  get label(): string {
    return this._label;
  }

  get tag(): string {
    return this._tag;
  }
}



//display data tag should be the type for the file sent to API
export class FileData {
  private _displayData: DisplayData;
  private _fileType: FileType;
  private _requires: string[];

  constructor(displayData: DisplayData, fileType: FileType, requires: string[]) {
    this._displayData = displayData;
    this._fileType = fileType;
    this._requires = requires;
  }

  get description(): string {
    return this._displayData.description;
  }

  get label(): string {
    return this._displayData.label;
  }

  get tag(): string {
    return this._displayData.tag;
  }

  get displayData(): DisplayData {
    return this._displayData;
  }

  get fileType(): FileType {
    return this._fileType;
  }

  get requires(): string[] {
    return this._requires;
  }
}

export class FileProperty {
  private _formData: FormNode;
  private _defaultValues: string[];

  constructor(formData: FormNode, defaultValues: string[]) {
    this._formData = formData;
    this._defaultValues = defaultValues;
  }

  get formData(): FormNode {
    return this._formData;
  }

  get defaultValues(): string[] {
    return this._defaultValues;
  }
}

class FileType {
  private _type: string;
  private _ext: string;
  private _description: string;

  constructor(type: string, ext: string, description: string) {
    this._type = type;
    this._ext = ext;
    this._description = description;
  }

  get type(): string {
    return this._type;
  }

  get ext(): string {
    return this._ext;
  }

  get description(): string {
    return this._description;
  }
}

export class FileGroup {
  private _fileData: FileData[];
  private _displayData: DisplayData;
  private _additionalProperties: FileProperty[];

  constructor(displayData: DisplayData, fileData: FileData[], additionalProperties: FileProperty[]) {
    this._fileData = fileData;
    this._displayData = displayData;
    this._additionalProperties = additionalProperties;
  }

  get description(): string {
    return this._displayData.description;
  }

  get label(): string {
    return this._displayData.label;
  }

  get tag(): string {
    return this._displayData.tag;
  }

  get displayData(): DisplayData {
    return this._displayData;
  }

   get fileData(): FileData[] {
    return this._fileData;
   }

   get additionalProperties(): FileProperty[] {
    return this._additionalProperties;
   }
}


//just make a separate structure for export, there are differences
//this doesn't need any separation so just have date range or no date range
//add period to additional properties in a file group is you want to allow multiples
export class ExportDatasetItem extends DatasetItem {
  private _fileGroups: FileGroup[];
  //can be null
  private _timeseriesHandler: TimeseriesHandler;

  constructor(fileGroups: FileGroup[], values: StringMap, label: string, timeseriesHandler?: TimeseriesHandler) {
    super(values, label);
    this._fileGroups = fileGroups;
    this._timeseriesHandler = timeseriesHandler;
  }

  get fileGroups(): FileGroup[] {
    return this._fileGroups;
  }

  get timeseriesHandler(): TimeseriesHandler {
    return this._timeseriesHandler;
  }

  get start(): Moment {
    return this._timeseriesHandler?.start;
  }

  get end(): Moment {
    return this._timeseriesHandler?.end;
  }

  get unit(): UnitOfTime {
    return this._timeseriesHandler?.unit;
  }

  get interval(): number {
    return this._timeseriesHandler?.interval;
  }

  get period(): PeriodData {
    return this._timeseriesHandler?.period;
  }
}




export class FormManager<T extends DatasetItem> {
  private _datasetFormData: DatasetFormData;
  private _datasets: {[tag: string]: Dataset<T>};
  private _values: StringMap;
  private _activeItem: T;
  private _state: StringMap;
  private _defaultState: StringMap;

  constructor(datasets: Dataset<T>[], datasetFormData: DatasetFormData, defaultState: StringMap) {
    this._defaultState = defaultState;
    this._state = Object.assign({}, defaultState);
    this._datasets = {};
    for(let dataset of datasets) {
      this._datasets[dataset.tag] = dataset;
    }
    this._datasetFormData = datasetFormData;
    this.updateState();
  }

  private updateState(): void {
    let dataset = this._datasets[this._state.datatype];
    let stateData = dataset.getStateData(this._state);
    this._state = stateData.state;
    this._activeItem = stateData.item;
    this._values = Object.assign({
      datatype: dataset.tag
    }, this._activeItem.values)
  }

  public resetState(): void {
    this._state = Object.assign({}, this._defaultState);
    this.updateState();
  }

  public setValue(field: string, tag: string): ActiveFormData<T> {
    if(field == "datatype") {
      return this.setDatatype(tag);
    }
    else {
      this._state[field] = tag;
      this.updateState();
      return this.getFormData();
    }
  }

  public setValues(values: StringMap): ActiveFormData<T> {
    Object.assign(this._state, values);
    this.updateState();
    return this.getFormData();
  }

  public setDatatype(tag: string): ActiveFormData<T> {
    if(this._datasets[tag]) {
      this._state["datatype"] = tag;
      this.updateState();
    }
    return this.getFormData();
  }

  public getFormData(): ActiveFormData<T> {
    return {
      datasetFormData: this._datasetFormData,
      datasetItem: this._activeItem,
      values: this._values
    };
  }
}

export type DisplayStyle = "diverging" | "standard" | "increasing";
