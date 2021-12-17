import IncidentReport from "./IncidentReport";

export default class IncidentReportMapper {
    // Map GraphQL incidentreport to the correct format for the API
    static mapIncidentReport(incidentReport : any) : IncidentReport {
        return {
            id: incidentReport._id,
            message: incidentReport.message,
            user: {
                id: incidentReport.user._id,
                first_name: incidentReport.user.first_name,
                last_name: incidentReport.user.last_name,
                company: incidentReport.user.company
            }
        }
    }
}
  