import { ResumeData } from "@/types/resume";
import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

// Registrar fontes para garantir estabilidade máxima em produção
// Roboto é a fonte com melhor suporte no motor do react-pdf
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
  ],
});

// Desativar hifenização para evitar erros de cálculo de layout
Font.registerHyphenationCallback((word) => [word]);

const PX = 0.75;

const styles = StyleSheet.create({
  page: {
    padding: "25mm",
    backgroundColor: "#FFFFFF",
    fontFamily: "Roboto",
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
    color: "#475569",
  },
  contactTextMain: {
    fontSize: 11 * PX,
    color: "#0f172a",
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
    color: "#64748b",
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
    color: "#334155",
  },
  location: {
    fontSize: 10 * PX,
    color: "#64748b",
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
    color: "#1e293b",
    textTransform: "uppercase",
  },
  langLevel: {
    fontSize: 10 * PX,
    color: "#475569",
    fontWeight: "bold",
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
  labels,
}: {
  data: ResumeData;
  colorTheme?: string;
  labels: {
    title: string;
    yourName: string;
    portfolio: string;
    experience: string;
    education: string;
    skills: string;
    languages: string;
    certifications: string;
    projects: string;
    volunteering: string;
    courses: string;
    current: string;
    at: string;
    repo: string;
    demo: string;
  };
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
    courses,
  } = data;

  const renderSectionTitle = (title: string) => (
    <View style={styles.sectionTitleContainer} wrap={false}>
      <Text style={[styles.sectionTitle, { color: colorTheme }]}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );

  return (
    <Document
      title={`${labels.title} - ${personalInfo.name || "Lume"}`}
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
            {personalInfo.name || labels.yourName}
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
                  src={`https://wa.me/${personalInfo.phone.replace(/\D/g, "")}?text=${encodeURIComponent(labels.demo === "Demo" ? "I saw your resume" : "Vim pelo seu currículo")}`}
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
                  {labels.portfolio.toUpperCase()}
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
            {renderSectionTitle(labels.experience)}
            {experiences.map((exp, i) => (
              <View key={i} style={styles.item} wrap={false}>
                <View style={styles.itemHeader}>
                  <View
                    style={{ flexDirection: "row", alignItems: "baseline" }}
                  >
                    <Text
                      style={[styles.itemTitle, { textTransform: "uppercase" }]}
                    >
                      {exp.company}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12 * PX,
                        color: "#475569",
                        fontWeight: "bold",
                        marginLeft: 4 * PX,
                      }}
                    >
                      — {exp.position}
                    </Text>
                  </View>
                  <Text style={styles.itemDate}>
                    {exp.startDate} —{" "}
                    {exp.current ? labels.current : exp.endDate}
                  </Text>
                </View>
                {exp.location && (
                  <Text style={[styles.location, { marginBottom: 2 * PX }]}>
                    {exp.location}
                  </Text>
                )}
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
            {renderSectionTitle(labels.education)}
            {educations.map((edu, i) => (
              <View key={i} style={{ marginBottom: 12 * PX }} wrap={false}>
                <View style={styles.itemHeader}>
                  <View
                    style={{ flexDirection: "row", alignItems: "baseline" }}
                  >
                    <Text
                      style={[
                        styles.itemTitle,
                        { fontSize: 13 * PX, textTransform: "uppercase" },
                      ]}
                    >
                      {edu.school}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11 * PX,
                        color: "#475569",
                        fontWeight: "bold",
                        marginLeft: 4 * PX,
                      }}
                    >
                      | {edu.degree} — {edu.field}
                    </Text>
                  </View>
                  <Text style={styles.itemDate}>{edu.graduationDate}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 3.1. Cursos */}
        {courses?.length > 0 && (
          <View>
            {renderSectionTitle(labels.courses)}
            {courses.map((c, i) => (
              <View key={i} style={{ marginBottom: 12 * PX }} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={[styles.itemTitle, { fontSize: 13 * PX }]}>
                    {c.name}
                  </Text>
                  <Text style={styles.itemDate}>
                    {c.startDate && `${c.startDate} — `}
                    {c.current ? labels.current : c.endDate}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 4. Habilidades */}
        {skills?.length > 0 && (
          <View>
            {renderSectionTitle(labels.skills)}
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
            {renderSectionTitle(labels.languages)}
            <View style={{ marginBottom: 24 * PX }}>
              {languages.map((l, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6 * PX,
                    marginBottom: 4 * PX,
                  }}
                  wrap={false}
                >
                  <Text style={styles.langName}>{l.name} —</Text>
                  <Text style={styles.langLevel}>
                    {l.conversation.toUpperCase()} (CONVERSAÇÃO) |{" "}
                    {l.writing.toUpperCase()} (ESCRITA) |{" "}
                    {l.reading.toUpperCase()} (LEITURA)
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 6. Certificações */}
        {certifications?.length > 0 && (
          <View>
            {renderSectionTitle(labels.certifications)}
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
            {renderSectionTitle(labels.projects)}
            {projects.map((proj, i) => (
              <View key={i} style={styles.item} wrap={false}>
                <View style={styles.projectHeader}>
                  <Text style={[styles.itemTitle, { fontSize: 13 * PX }]}>
                    {proj.name}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 12 * PX }}>
                    {proj.github && (
                      <Link style={styles.linkSmall} src={proj.github}>
                        {labels.repo}
                      </Link>
                    )}
                    {proj.deploy && (
                      <Link style={styles.linkSmall} src={proj.deploy}>
                        {labels.demo}
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
            {renderSectionTitle(labels.volunteering)}
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
