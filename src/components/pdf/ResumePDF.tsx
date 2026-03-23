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
    padding: "25mm",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    color: "#1e293b",
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 2,
    paddingBottom: 24,
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: -1,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginBottom: 12,
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
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#334155",
    marginTop: 8,
  },
  sectionTitleBox: {
    borderBottomWidth: 1,
    paddingBottom: 4,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  item: {
    marginBottom: 24,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 11.5,
    fontWeight: "bold",
    color: "#0f172a",
  },
  itemDate: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
  },
  itemSubHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  company: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: "#334155",
  },
  location: {
    fontSize: 8.5,
    color: "#94a3b8",
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
  languageList: {
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
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: 1,
  },
});

export const ResumePDF = ({
  data,
  colorTheme = "#18181b",
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

  const softBorderColor = colorTheme + "4D";

  return (
    <Document
      title={`Currículo - ${personalInfo.name || "Lume"}`}
      author="Lume"
    >
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
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
              <Text style={styles.contactText}>{personalInfo.location}</Text>
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
        {experiences?.length > 0 && (
          <View wrap={false}>
            <View
              style={[
                styles.sectionTitleBox,
                { borderBottomColor: softBorderColor },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colorTheme }]}>
                Experiência Profissional
              </Text>
            </View>
            {experiences.map((exp, i) => (
              <View key={i} style={styles.item} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.itemDate}>
                    {exp.startDate} — {exp.current ? "Presente" : exp.endDate}
                  </Text>
                </View>
                <View style={styles.itemSubHeader}>
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
        {educations?.length > 0 && (
          <View wrap={false}>
            <View
              style={[
                styles.sectionTitleBox,
                { borderBottomColor: softBorderColor },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colorTheme }]}>
                Formação Acadêmica
              </Text>
            </View>
            {educations.map((edu, i) => (
              <View key={i} style={{ marginBottom: 16 }} wrap={false}>
                <View style={styles.itemHeader}>
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
        {skills?.length > 0 && (
          <View wrap={false}>
            <View
              style={[
                styles.sectionTitleBox,
                { borderBottomColor: softBorderColor },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colorTheme }]}>
                Habilidades Técnicas
              </Text>
            </View>
            <View style={styles.skillsGrid}>
              {skills.map((s, i) => (
                <Text key={i} style={styles.skillTag}>
                  {s}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Idiomas */}
        {languages?.length > 0 && (
          <View wrap={false} style={{ marginTop: 10 }}>
            <View
              style={[
                styles.sectionTitleBox,
                { borderBottomColor: softBorderColor },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colorTheme }]}>
                Idiomas
              </Text>
            </View>
            <View style={styles.languageList}>
              {languages.map((l, i) => (
                <View key={i} style={styles.languageItem}>
                  <Text style={styles.langName}>{l.name}</Text>
                  <Text style={styles.langLevel}>{l.level}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Certificações */}
        {certifications?.length > 0 && (
          <View wrap={false} style={{ marginTop: 10 }}>
            <View
              style={[
                styles.sectionTitleBox,
                { borderBottomColor: softBorderColor },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colorTheme }]}>
                Certificações
              </Text>
            </View>
            {certifications.map((cert, i) => (
              <View key={i} style={{ marginBottom: 12 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{cert.name}</Text>
                  <Text style={styles.itemDate}>{cert.date}</Text>
                </View>
                <Text style={styles.company}>{cert.issuer}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Voluntariado */}
        {volunteering?.length > 0 && (
          <View wrap={false} style={{ marginTop: 10 }}>
            <View
              style={[
                styles.sectionTitleBox,
                { borderBottomColor: softBorderColor },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colorTheme }]}>
                Voluntariado
              </Text>
            </View>
            {volunteering.map((vol, i) => (
              <View key={i} style={{ marginBottom: 12 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{vol.organization}</Text>
                  <Text style={styles.itemDate}>{vol.role}</Text>
                </View>
                {vol.description && (
                  <Text style={styles.description}>{vol.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projetos */}
        {projects?.length > 0 && (
          <View wrap={false} style={{ marginTop: 10 }}>
            <View
              style={[
                styles.sectionTitleBox,
                { borderBottomColor: softBorderColor },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colorTheme }]}>
                Projetos
              </Text>
            </View>
            {projects.map((proj, i) => (
              <View key={i} style={styles.item} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{proj.name}</Text>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    {proj.github && <Text style={styles.link}>REPO</Text>}
                    {proj.deploy && <Text style={styles.link}>LIVE</Text>}
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
