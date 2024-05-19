const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, LevelFormat, convertInchesToTwip } = require('docx');

function createReport(pipeline) {
    const { idPipe, allNodes, linksInfo, components } = pipeline;

    try {
        const doc = new Document({
            creator: "Система Отчета",
            title: `Отчет о сети ${idPipe}`,
            sections: [
                {
                    properties: { titlePage: true },
                    children: [
                        // Заголовок отчета
                        new Paragraph({
                            text: `Отчет о сети ${idPipe}`,
                            heading: HeadingLevel.TITLE,
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 400 },
                        }),

                        // Компоненты сети
                        new Paragraph({
                            text: "Компоненты сети:",
                            heading: HeadingLevel.HEADING_1,
                        }),

                        ...allNodes.map((node, index) =>
                            new Paragraph({
                                children: [
                                    new TextRun({ text: ` ${index + 1}. ${node.data.name}`, bullet: true, bold: true }),
                                ],
                            })
                        ),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "", // Пустая строка
                                    break: 1, // Разрыв строки
                                }),
                            ]
                        }),

                        // Связи
                        new Paragraph({
                            text: "Связи:",
                            heading: HeadingLevel.HEADING_1,
                        }),

                        ...linksInfo.map((link, index) =>
                            new Paragraph({
                                children: [
                                    new TextRun({ text: ` ${index + 1}. Связь (${link.startName} - ${link.endName})`, bullet: true, bold: true }),
                                ],
                            })
                        ),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "", // Пустая строка
                                    break: 1, // Разрыв строки
                                }),
                            ]
                        }),

                        // Информация об узлах
                        new Paragraph({
                            text: "Информация об узлах:",
                            heading: HeadingLevel.HEADING_1,
                        }),

                        ...components.junctions.map((junction, index) =>
                            new Paragraph({
                                children: [
                                    new TextRun({ text: ` ${index + 1}. ${junction.name}`, bullet: true, bold: true }),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Давление: ${junction.init_pressure || "не указано"} (бары)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Температура: ${junction.temperature || "не указано"} (Кельвины)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                ],
                            })
                        ),

                        // Информация о трубах
                        new Paragraph({
                            text: "Информация о трубах:",
                            heading: HeadingLevel.HEADING_1,
                        }),
                        ...components.pipes.map((pipe, index) =>
                            new Paragraph({
                                children: [
                                    new TextRun({ text: ` ${index + 1}. Труба (${pipe.startName} - ${pipe.endName})`, bullet: true, bold: true }),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Диаметр: ${pipe.diameter || "не указан"} (м)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Длина: ${pipe.length || "не указано"} (км)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Коэффициент потерь: ${pipe.loss_coefficient || "не указан"} (W/(m²·K))`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Коэффициент теплопередачи: ${pipe.alpha_w_per_m2k || "не указано"}`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Коэффициент потерь: ${pipe.qext_w || "не указано"}`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                ],
                            })
                        ),

                        new Paragraph({
                            text: "Информация о внешних сетях:",
                            heading: HeadingLevel.HEADING_1,
                        }),

                        ...components.ext_grids.map((extGrid, index) =>
                            new Paragraph({
                                children: [
                                    new TextRun({ text: ` ${index + 1}. ${extGrid.name}`, bullet: true, bold: true }),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Давление: ${extGrid.pressure || "не указано"} (бары)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                ],
                            })
                        ),

                        // Информация о насосах
                        new Paragraph({
                            text: "Информация о насосах:",
                            heading: HeadingLevel.HEADING_1,
                        }),
                        ...components.pumps.map((pump, index) =>
                            new Paragraph({
                                children: [
                                    new TextRun({ text: ` ${index + 1}. ${pump.name}`, bullet: true, bold: true }),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Подъем давления: ${pump.results.pressure_lift || "не указан"}`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                ],
                            })
                        ),

                        // Информация об источниках
                        new Paragraph({
                            text: "Информация об источниках:",
                            heading: HeadingLevel.HEADING_1,
                        }),

                        ...components.sources.map((source, index) =>
                            new Paragraph({
                                children: [
                                    new TextRun({ text: ` ${index + 1}. ${source.name}`, bullet: true, bold: true }),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Массовый поток: ${source.mdot_kg_per_s || "не указан"} (кг/с)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                ],
                            })
                        ),

                        // Информация о стоках
                        new Paragraph({
                            text: "Информация о стоках:",
                            heading: HeadingLevel.HEADING_1,
                        }),

                        ...components.sinks.map((sink, index) =>
                            new Paragraph({
                                children: [
                                    new TextRun({ text: ` ${index + 1}.${sink.name}`, bullet: true, bold: true }),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Массовый поток: ${sink.mdot_kg_per_s || "не указан"} (кг/с)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                ],
                            })
                        ),

                        // Информация о внешних сетях


                        // Результаты расчетов
                        new Paragraph({
                            text: `Результаты расчетов:`,
                            heading: HeadingLevel.TITLE,
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 400 },
                            children: [
                                new TextRun({
                                    text: "", // Пустая строка
                                    break: 1, // Разрыв строки
                                }),
                            ]
                        }),
                        new Paragraph({
                            text: "Результаты узлов:",
                            heading: HeadingLevel.HEADING_1,
                            children: [
                                new TextRun({
                                    text: "", // Пустая строка
                                    break: 1, // Разрыв строки
                                }),
                            ]
                        }),

                        ...components.junctions.map((junction, index) =>
                            new Paragraph({
                                children: [
                                    new TextRun({ text: ` ${index + 1}. ${junction.name}`, bullet: true, bold: true }),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Давление: ${junction.results.p_bar}(бары)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Температура: ${junction.results.t_k} (Кельвины)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                ],
                            })
                        ),
                        new Paragraph({
                            text: "Результаты труб:",
                            heading: HeadingLevel.HEADING_1,
                            children: [
                                new TextRun({
                                    text: "", // Пустая строка
                                    break: 1, // Разрыв строки
                                }),
                            ]
                        }),

                        ...components.pipes.map((pipe, index) =>
                            new Paragraph({
                                children: [
                                    new TextRun({ text: ` ${index + 1}. Труба (${pipe.startName} - ${pipe.endName})`, bullet: true, bold: true }),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Давление на входе: ${pipe.results.pressure_from} (бары)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Давление на выходе: ${pipe.results.pressure_to} (бары)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Температура на входе: ${pipe.results.temperature_from} (Кельвины)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Температура на выходе: ${pipe.results.temperature_to} (Кельвины)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Нормированный объемный поток: ${pipe.results.volume_flow_norm} (м³/с)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Массовый поток на входе: ${pipe.results.mass_flow_from} (кг/с)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Массовый поток на выходе: ${pipe.results.mass_flow_to} (кг/с)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Средняя скорость: ${pipe.results.velocity_mean} (м/с)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Число Рейнольдса: ${pipe.results.reynolds_number}`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Коэффициент трения: ${pipe.results.friction_factor}`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                ],
                            })
                        ),
                        new Paragraph({
                            text: "Результаты внешних сетей:",
                            heading: HeadingLevel.HEADING_1,
                            children: [
                                new TextRun({
                                    text: "", // Пустая строка
                                    break: 1, // Разрыв строки
                                }),
                            ]
                        }),
                        ...components.ext_grids.map((extGrid, index) =>
                            new Paragraph({
                                children: [
                                    new TextRun({ text: ` ${index + 1}. ${extGrid.name}`, bullet: true, bold: true }),// Размер шрифта в половинах пункта (24 пункта)

                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Массовый поток: ${extGrid.results.mdot_kg_per_s} (кг/с)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                ],
                            })
                        ),


                        new Paragraph({
                            text: "Результаты насосов:",
                            heading: HeadingLevel.HEADING_1,
                            children: [
                                new TextRun({
                                    text: "", // Пустая строка
                                    break: 1, // Разрыв строки
                                }),
                            ]
                        }),

                        ...components.pumps.map((pump, index) =>
                            new Paragraph({
                                children: [
                                    new TextRun({ text: ` ${index + 1}.} ${pump.name}`, bullet: true, bold: true }),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Подъем давления: ${pump.results.pressure_lift} (баоы)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                ],
                            })
                        ),
                        new Paragraph({
                            text: "Результаты источников:",
                            heading: HeadingLevel.HEADING_1,
                            children: [
                                new TextRun({
                                    text: "", // Пустая строка
                                    break: 1, // Разрыв строки
                                }),
                            ]
                        }),

                        ...components.sources.map((source, index) =>
                            new Paragraph({
                                children: [
                                    new TextRun({ text: ` ${index + 1}. ${source.name}`, bullet: true, bold: true }),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Массовый поток: ${source.results.mass_flow} (кг/с)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                ],
                            })
                        ),

                        new Paragraph({
                            text: "Результаты стоков:",
                            heading: HeadingLevel.HEADING_1,
                            children: [
                                new TextRun({
                                    text: "", // Пустая строка
                                    break: 1, // Разрыв строки
                                }),
                            ]
                        }),
                        ...components.sinks.map((sink, index) =>
                            new Paragraph({
                                children: [
                                    new TextRun({ text: ` ${index + 1}. ${sink.name}`, bullet: true, bold: true }),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                    new TextRun(`\n  • Массовый поток: ${sink.results.mass_flow} (кг/с)`),
                                    new TextRun({
                                        text: "", // Пустая строка
                                        break: 1, // Разрыв строки
                                    }),
                                ],
                            })
                        ),

                    ]
                }
            ]
        });

        return doc

    } catch (err) {
        console.log(err)
    }

}

async function generateDocxBuffer(pipeline) {
    const doc = createReport(pipeline);
    return await Packer.toBuffer(doc);
}

module.exports = { generateDocxBuffer };