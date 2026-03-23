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
  page: {
    padding: "20mm",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 2,
    paddingBottom: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: -1.5,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginBottom: 10,
  },
  contactText: {
    fontSize: 8.5,
    color: "#475569",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  link: {
    fontSize: 8.5,
    color: "#2563EB",
    textDecoration: "none",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#334155",
    fontWeight: "medium",
  },
  section: {
    marginTop: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingBottom: 3,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  item: {
    marginBottom: 18,
  },
  itemMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 11.5,
    fontWeight: "bold",
    color: "#0F172A",
  },
  itemDate: {
    fontSize: 7.5,
    fontWeight: 900,
    color: "#64748B",
    textTransform: "uppercase",
  },
  itemSub: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  company: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: "#334155",
  },
  location: {
    fontSize: 8.5,
    color: "#94A3B8",
    fontStyle: "italic",
  },
  description: {
    fontSize: 9.5,
    lineHeight: 1.5,
    color: "#475569",
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillTag: {
    fontSize: 8.5,
    fontWeight: "bold",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: "3 8",
    borderRadius: 4,
    color: "#334155",
    textTransform: "uppercase",
  },
  // Disposição lado a lado para idiomas e certificações
  horizontalList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 25,
  },
  languageItem: {
    flexDirection: "column",
    marginBottom: 5,
  },
  langName: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: "#0F172A",
  },
  langLevel: {
    fontSize: 7.5,
    color: "#64748B",
    fontWeight: 900,
    textTransform: "uppercase",
    marginTop: 1,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  projectLinks: {
    flexDirection: "row",
    gap: 10,
  },
});

export const ResumePDF = ({
  data,
  colorTheme = "#000000",
}: {
  data: ResumeData;
  colorTheme?: string;
}) => {
  const {
    personalInfo,
    experiences,
    educations,
    skills,
    projects,
    languages,
    certifications,
    volunteering,
  } = data;

  // Cor de borda suave (30% opacidade aproximada)
  const softBorderColor = colorTheme + "4D";

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
              <Text style={styles.contactText}>{personalInfo.email}</Text>
            )}
            {personalInfo.phone && (
              <Text style={styles.contactText}>{personalInfo.phone}</Text>
            )}
            {personalInfo.location && (
              <Text style={styles.contactText}>
                {personalInfo.location.toUpperCase()}
              </Text>
            )}
            {personalInfo.linkedin && (
              <Link style={styles.link} src={personalInfo.linkedin}>
                LINKEDIN
              </Link>
            )}
            {personalInfo.website && (
              <Link style={styles.link} src={personalInfo.website}>
                PORTFOLIO
              </Link>
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
                { borderBottomColor: softBorderColor },
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
                <View style={styles.itemSub}>
                  <Text style={styles.company}>{exp.company}</Text>
                  {exp.location && (
                    <Text style={styles.location}>{exp.location}</Text>
                  )}
                </View>
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
                { borderBottomColor: softBorderColor },
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

        {/* Idiomas - Lado a Lado como no Preview */}
        {languages && languages.length > 0 && (
          <View style={styles.section}>
            <View
              style={[
                styles.sectionHeader,
                { borderBottomColor: softBorderColor },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colorTheme }]}>
                Idiomas
              </Text>
            </View>
            <View style={styles.horizontalList}>
              {languages.map((lang, i) => (
                <View key={i} style={styles.languageItem}>
                  <Text style={styles.langName}>{lang.name}</Text>
                  <Text style={styles.langLevel}>{lang.level}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <View
              style={[
                styles.sectionHeader,
                { borderBottomColor: softBorderColor },
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

        {/* Certificações */}
        {certifications && certifications.length > 0 && (
          <View style={styles.section}>
            <View
              style={[
                styles.sectionHeader,
                { borderBottomColor: softBorderColor },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colorTheme }]}>
                Certificações
              </Text>
            </View>
            <View style={styles.horizontalList}>
              {certifications.map((cert, i) => (
                <View key={i} style={{ width: "45%" }}>
                  <Text
                    style={{
                      fontSize: 10.5,
                      fontWeight: "bold",
                      color: "#0F172A",
                    }}
                  >
                    {cert.name}
                  </Text>
                  <Text style={{ fontSize: 8, color: "#64748B" }}>
                    {cert.issuer} • {cert.date}
                  </Text>
                </View>
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
                { borderBottomColor: softBorderColor },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colorTheme }]}>
                Projetos
              </Text>
            </View>
            {projects.map((proj, i) => (
              <View key={i} style={styles.item} wrap={false}>
                <View style={styles.projectHeader}>
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
