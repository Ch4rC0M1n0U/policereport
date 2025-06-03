import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  warning: {
    color: "orange",
    marginTop: 10,
  },
})

export default function ReportPDF({ data }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Date: {data.date}</Text>
          <Text>Série: {data.serie}</Text>
          <Text>Identifiant Officier: {data.officerId}</Text>
          {data.constatTeamsWarning && <Text style={styles.warning}>{data.constatTeamsWarning}</Text>}
          {/* Add more fields here */}
        </View>
      </Page>
    </Document>
  )
}
