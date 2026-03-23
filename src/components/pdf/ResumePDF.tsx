import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import { ResumeData } from "@/types/resume";

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: "#FFFFFF", fontFamily: "Helvetica" },
  header: {
    marginBottom: 20,
    borderBottom: "2 solid #000000",
    paddingBottom: 15,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 5 },
  contactItem: { flexDirection: "row", alignItems: "center" },
  contactText: { fontSize: 9, color: "#444444", fontWeight: "bold" },
  link: {
    fontSize: 9,
    color: "#000000",
    textDecoration: "none",
    fontWeight: "bold",
  },
  summary: { fontSize: 10, lineHeight: 1.5, marginTop: 10, color: "#333333" },
  section: { marginTop: 20 },
  sectionHeader: {
    borderBottom: "1 solid #EEEEEE",
    paddingBottom: 4,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  item: { marginBottom: 15 },
  itemMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  itemTitle: { fontSize: 12, fontWeight: "bold", color: "#000000" },
  itemDate: { fontSize: 8, fontWeight: "bold", color: "#666666" },
  company: { fontSize: 10, fontWeight: "bold", color: "#444444", marginTop: 2 },
  description: {
    fontSize: 10,
    lineHeight: 1.4,
    color: "#333333",
    marginTop: 5,
  },
  skillsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  skillTag: {
    fontSize: 8,
    fontWeight: "bold",
    backgroundColor: "#F0F0F0",
    padding: "3 6",
    borderRadius: 3,
    color: "#333333",
  },
  projectLinks: { flexDirection: "row", gap: 10, marginTop: 4 },
});

export const ResumePDF = ({
  data,
  colorTheme = "#000000",
}: {
  data: ResumeData;
  colorTheme?: string;
}) => {
  const { personalInfo, experiences, educations, skills, projects } = data;

  return (
    <Document title={`Curriculo - ${personalInfo.name}`} author="Lume">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colorTheme }]}>
          <Text style={[styles.name, { color: colorTheme }]}>
            {personalInfo.name || "Seu Nome"}
          </Text>
          <View style={styles.contactRow}>
            {personalInfo.email && (
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>
                  {personalInfo.email.toUpperCase()}
                </Text>
              </View>
            )}
            {personalInfo.phone && (
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>{personalInfo.phone}</Text>
              </View>
            )}
            {personalInfo.location && (
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>
                  {personalInfo.location.toUpperCase()}
                </Text>
              </View>
            )}
            {personalInfo.linkedin && (
              <View style={styles.contactItem}>
                <Link style={styles.link} src={personalInfo.linkedin}>
                  LINKEDIN
                </Link>
              </View>
            )}
            {personalInfo.website && (
              <View style={styles.contactItem}>
                <Link style={styles.link} src={personalInfo.website}>
                  PORTFOLIO
                </Link>
              </View>
            )}
          </View>
          {personalInfo.summary && (
            <Text style={styles.summary}>{personalInfo.summary}</Text>
          )}
        </View>

        {/* Experiência */}
        {experiences && experiences.length > 0 && (
          <View style={styles.section}>
            <View
              style={[
                styles.sectionHeader,
                { borderBottomColor: colorTheme + "40" },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colorTheme }]}>
                Experiência Profissional
              </Text>
            </View>
            {experiences.map((exp, i) => (
              <View key={i} style={styles.item} wrap={false}>
                <View style={styles.itemMain}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.itemDate}>
                    {exp.startDate} — {exp.current ? "Presente" : exp.endDate}
                  </Text>
                </View>
                <Text style={styles.company}>{exp.company}</Text>
                {exp.description && (
                  <Text style={styles.description}>
                    {exp.description.replace(/[*-]/g, "•")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Educação */}
        {educations && educations.length > 0 && (
          <View style={styles.section}>
            <View
              style={[
                styles.sectionHeader,
                { borderBottomColor: colorTheme + "40" },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colorTheme }]}>
                Formação Acadêmica
              </Text>
            </View>
            {educations.map((edu, i) => (
              <View key={i} style={styles.item} wrap={false}>
                <View style={styles.itemMain}>
                  <Text style={styles.itemTitle}>
                    {edu.degree} em {edu.field}
                  </Text>
                  <Text style={styles.itemDate}>{edu.graduationDate}</Text>
                </View>
                <Text style={styles.company}>{edu.school}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <View
              style={[
                styles.sectionHeader,
                { borderBottomColor: colorTheme + "40" },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colorTheme }]}>
                Habilidades Técnicas
              </Text>
            </View>
            <View style={styles.skillsGrid}>
              {skills.map((skill, i) => (
                <Text key={i} style={styles.skillTag}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Projetos */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <View
              style={[
                styles.sectionHeader,
                { borderBottomColor: colorTheme + "40" },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colorTheme }]}>
                Projetos
              </Text>
            </View>
            {projects.map((proj, i) => (
              <View key={i} style={styles.item} wrap={false}>
                <Text style={styles.itemTitle}>{proj.name}</Text>
                <View style={styles.projectLinks}>
                  {proj.github && (
                    <Link style={styles.link} src={proj.github}>
                      REPO GITHUB
                    </Link>
                  )}
                  {proj.deploy && (
                    <Link style={styles.link} src={proj.deploy}>
                      LIVE DEMO
                    </Link>
                  )}
                </View>
                {proj.description && (
                  <Text style={styles.description}>{proj.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
