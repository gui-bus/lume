import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
  Font,
} from "@react-pdf/renderer";
import { ResumeData } from "@/types/resume";

// Registrar fontes para garantir que o negrito funcione
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2",
      fontWeight: "bold",
    },
  ],
});

const PX = 0.75;

const styles = StyleSheet.create({
  page: {
    padding: "25mm",
    backgroundColor: "#FFFFFF",
    fontFamily: "Inter",
    color: "#1e293b",
  },

  header: {
    marginBottom: 24 * PX,
  },
  name: {
    fontSize: 28 * PX,
    fontWeight: "bold",
    letterSpacing: -0.5,
    marginBottom: 6 * PX,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 2,
    marginBottom: 8 * PX,
  },
  contactText: {
    fontSize: 11 * PX,
    color: "#64748b",
  },
  contactTextMain: {
    fontSize: 11 * PX,
    color: "#1e293b",
  },
  bullet: {
    fontSize: 11 * PX,
    color: "#cbd5e1",
    marginHorizontal: 4 * PX,
  },
  link: {
    fontSize: 11 * PX,
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "bold",
  },
  linkSmall: {
    fontSize: 9 * PX,
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "bold",
  },
  summary: {
    fontSize: 12 * PX,
    lineHeight: 1.5,
    color: "#475569",
    marginTop: 8 * PX,
  },

  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12 * PX,
    marginBottom: 16 * PX,
    marginTop: 4 * PX,
  },
  sectionTitle: {
    fontSize: 10 * PX,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  sectionLine: {
    flex: 1,
    height: 0.5 * PX,
    backgroundColor: "#e2e8f0",
  },

  item: {
    marginBottom: 18 * PX,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2 * PX,
  },
  itemTitle: {
    fontSize: 14 * PX,
    fontWeight: "bold",
    color: "#0f172a",
  },
  itemDate: {
    fontSize: 10 * PX,
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  itemSubHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4 * PX,
  },
  company: {
    fontSize: 13 * PX,
    fontWeight: "bold",
    color: "#475569",
  },
  location: {
    fontSize: 10 * PX,
    color: "#94a3b8",
  },
  description: {
    fontSize: 12 * PX,
    lineHeight: 1.5,
    color: "#475569",
    marginTop: 4 * PX,
  },

  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6 * PX,
    marginBottom: 24 * PX,
  },
  skillTag: {
    fontSize: 10 * PX,
    fontWeight: "bold",
    backgroundColor: "#f8fafc",
    borderWidth: 0.5 * PX,
    borderColor: "#e2e8f0",
    padding: "2 6",
    borderRadius: 4 * PX,
    color: "#475569",
  },

  languageItem: {
    flexDirection: "row",
    gap: 6 * PX,
    alignItems: "center",
    marginBottom: 6 * PX,
  },
  langName: {
    fontSize: 11 * PX,
    fontWeight: "bold",
    color: "#334155",
  },
  langLevel: {
    fontSize: 10 * PX,
    color: "#94a3b8",
    textTransform: "uppercase",
  },

  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4 * PX,
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

  const renderSectionTitle = (title: string) => (
    <View style={styles.sectionTitleContainer} wrap={false}>
      <Text style={[styles.sectionTitle, { color: colorTheme }]}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );

  return (
    <Document
      title={`Currículo - ${personalInfo.name || "Lume"}`}
      author="Lume"
    >
      <Page size="A4" style={styles.page}>
        {/* 1. Cabeçalho */}
        <View style={styles.header}>
          <Text
            style={[
              styles.name,
              { color: colorTheme, textTransform: "uppercase" },
            ]}
          >
            {personalInfo.name || "Seu Nome"}
          </Text>
          <View style={styles.contactRow}>
            {personalInfo.email && (
              <Link style={styles.link} src={`mailto:${personalInfo.email}`}>
                {personalInfo.email}
              </Link>
            )}
            {personalInfo.phone && (
              <>
                <Text style={styles.bullet}>•</Text>
                <Link
                  style={styles.link}
                  src={`https://wa.me/${personalInfo.phone.replace(/\D/g, "")}?text=${encodeURIComponent("Vim pelo seu currículo")}`}
                >
                  {personalInfo.phone}
                </Link>
              </>
            )}
            {personalInfo.location && (
              <>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.contactText}>{personalInfo.location}</Text>
              </>
            )}
            {personalInfo.linkedin && (
              <>
                <Text style={styles.bullet}>•</Text>
                <Link style={styles.link} src={personalInfo.linkedin}>
                  LINKEDIN
                </Link>
              </>
            )}
            {personalInfo.github && (
              <>
                <Text style={styles.bullet}>•</Text>
                <Link style={styles.link} src={personalInfo.github}>
                  GITHUB
                </Link>
              </>
            )}
            {personalInfo.website && (
              <>
                <Text style={styles.bullet}>•</Text>
                <Link style={styles.link} src={personalInfo.website}>
                  PORTFÓLIO
                </Link>
              </>
            )}
          </View>
          {personalInfo.summary && (
            <Text style={styles.summary}>{personalInfo.summary}</Text>
          )}
        </View>

        {/* 2. Experiência */}
        {experiences?.length > 0 && (
          <View>
            {renderSectionTitle("Experiência Profissional")}
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

        {/* 3. Educação */}
        {educations?.length > 0 && (
          <View>
            {renderSectionTitle("Formação Acadêmica")}
            {educations.map((edu, i) => (
              <View key={i} style={{ marginBottom: 12 * PX }} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={[styles.itemTitle, { fontSize: 13 * PX }]}>
                    {edu.degree} em {edu.field}
                  </Text>
                  <Text style={styles.itemDate}>{edu.graduationDate}</Text>
                </View>
                <Text style={styles.company}>{edu.school}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 4. Habilidades */}
        {skills?.length > 0 && (
          <View>
            {renderSectionTitle("Habilidades")}
            <View style={styles.skillsGrid}>
              {skills.map((s, i) => (
                <Text key={i} style={styles.skillTag}>
                  {s}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* 5. Idiomas */}
        {languages?.length > 0 && (
          <View>
            {renderSectionTitle("Idiomas")}
            <View style={{ marginBottom: 24 * PX }}>
              {languages.map((l, i) => (
                <View key={i} style={styles.languageItem} wrap={false}>
                  <Text style={styles.langName}>{l.name}:</Text>
                  <Text style={styles.langLevel}>{l.level}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 6. Certificações */}
        {certifications?.length > 0 && (
          <View>
            {renderSectionTitle("Certificações")}
            {certifications.map((c, i) => (
              <View key={i} style={{ marginBottom: 12 * PX }} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={[styles.itemTitle, { fontSize: 12 * PX }]}>
                    {c.name}
                  </Text>
                  <Text style={styles.itemDate}>{c.date}</Text>
                </View>
                <Text style={styles.company}>{c.issuer}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 7. Projetos */}
        {projects?.length > 0 && (
          <View>
            {renderSectionTitle("Projetos")}
            {projects.map((proj, i) => (
              <View key={i} style={styles.item} wrap={false}>
                <View style={styles.projectHeader}>
                  <Text style={[styles.itemTitle, { fontSize: 13 * PX }]}>
                    {proj.name}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 12 * PX }}>
                    {proj.github && (
                      <Link style={styles.linkSmall} src={proj.github}>
                        Repositório
                      </Link>
                    )}
                    {proj.deploy && (
                      <Link style={styles.linkSmall} src={proj.deploy}>
                        Demo
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

        {/* 8. Voluntariado */}
        {volunteering?.length > 0 && (
          <View>
            {renderSectionTitle("Voluntariado")}
            {volunteering.map((v, i) => (
              <View key={i} style={{ marginBottom: 12 * PX }} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={[styles.itemTitle, { fontSize: 13 * PX }]}>
                    {v.organization}
                  </Text>
                  <Text style={styles.itemDate}>{v.role}</Text>
                </View>
                {v.description && (
                  <Text style={styles.description}>{v.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
