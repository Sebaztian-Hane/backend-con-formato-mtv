export const mockEvents = [
 {
   id: 1,
   title: 'Consulta General',
   start: new Date(2025, 4, 23, 9, 0),
   end: new Date(2025, 4, 23, 9, 30),
   details: {
     paciente: 'Juan Pérez López',
     tipo: 'Consulta de rutina',
     sala: 'Consultorio 1',
     estado: 'Confirmada',
     observaciones: 'Control anual'
   }
 },
 {
   id: 2,
   title: 'Revisión Postoperatoria',
   start: new Date(2025, 4, 23, 11, 0),
   end: new Date(2025, 4, 23, 11, 45),
   details: {
     paciente: 'María García Martínez',
     tipo: 'Seguimiento',
     sala: 'Consultorio 3',
     estado: 'Confirmada',
     observaciones: 'Masajitos ps xsd'
   }
 },

 {
   id: 3,
   title: 'Terapia Física',
   start: new Date(2025, 4, 26, 8, 0),
   end: new Date(2025, 4, 26, 9, 0),
   details: {
     paciente: 'Carlos Rodríguez Vega',
     tipo: 'Rehabilitación muscular',
     sala: 'Sala de Terapia 1',
     estado: 'Confirmada',
     observaciones: 'Lesión de hombro - sesión 5/10'
   }
 },
 {
   id: 4,
   title: 'Terapia Respiratoria',
   start: new Date(2025, 4, 26, 10, 30),
   end: new Date(2025, 4, 26, 11, 30),
   details: {
     paciente: 'Ana Sofía Morales',
     tipo: 'Rehabilitación pulmonar',
     sala: 'Sala de Terapia 2',
     estado: 'Confirmada',
     observaciones: 'Post-COVID, ejercicios respiratorios'
   }
 },
 {
   id: 5,
   title: 'Terapia Ocupacional',
   start: new Date(2025, 4, 27, 9, 15),
   end: new Date(2025, 4, 27, 10, 15),
   details: {
     paciente: 'Roberto Silva Campos',
     tipo: 'Rehabilitación motora',
     sala: 'Sala de Terapia 3',
     estado: 'Pendiente',
     observaciones: 'Accidente cerebrovascular - motricidad fina'
   }
 },
 {
   id: 6,
   title: 'Hidroterapia',
   start: new Date(2025, 4, 27, 14, 0),
   end: new Date(2025, 4, 27, 15, 0),
   details: {
     paciente: 'Laura Mendoza Torres',
     tipo: 'Terapia acuática',
     sala: 'Piscina Terapéutica',
     estado: 'Confirmada',
     observaciones: 'Artritis reumatoide - ejercicios de bajo impacto'
   }
 },
 {
   id: 7,
   title: 'Fisioterapia Neurológica',
   start: new Date(2025, 4, 28, 8, 30),
   end: new Date(2025, 4, 28, 9, 30),
   details: {
     paciente: 'Miguel Ángel Herrera',
     tipo: 'Rehabilitación neurológica',
     sala: 'Sala de Terapia 1',
     estado: 'Confirmada',
     observaciones: 'Parkinson - ejercicios de equilibrio'
   }
 },
 {
   id: 8,
   title: 'Terapia del Lenguaje',
   start: new Date(2025, 4, 28, 11, 0),
   end: new Date(2025, 4, 28, 12, 0),
   details: {
     paciente: 'Isabella Ramírez Cruz',
     tipo: 'Fonoaudiología',
     sala: 'Consultorio 2',
     estado: 'Confirmada',
     observaciones: 'Afasia post-ictus - sesión de comunicación'
   }
 },
 {
   id: 9,
   title: 'Electroterapia',
   start: new Date(2025, 4, 29, 10, 0),
   end: new Date(2025, 4, 29, 10, 45),
   details: {
     paciente: 'Fernando López Sánchez',
     tipo: 'Estimulación eléctrica',
     sala: 'Sala de Equipos',
     estado: 'Confirmada',
     observaciones: 'Dolor lumbar crónico - TENS'
   }
 },
 {
   id: 10,
   title: 'Terapia Manual',
   start: new Date(2025, 4, 29, 15, 30),
   end: new Date(2025, 4, 29, 16, 30),
   details: {
     paciente: 'Gabriela Moreno Díaz',
     tipo: 'Masoterapia',
     sala: 'Sala de Terapia 2',
     estado: 'Confirmada',
     observaciones: 'Contractura cervical - técnicas manuales'
   }
 },
 {
   id: 11,
   title: 'Terapia Pediátrica',
   start: new Date(2025, 4, 30, 9, 0),
   end: new Date(2025, 4, 30, 10, 0),
   details: {
     paciente: 'Sebastián Vargas Ruiz',
     tipo: 'Fisioterapia infantil',
     sala: 'Sala Pediátrica',
     estado: 'Confirmada',
     observaciones: 'Parálisis cerebral - estimulación temprana'
   }
 },
 {
   id: 12,
   title: 'Terapia Psicológica',
   start: new Date(2025, 4, 30, 14, 0),
   end: new Date(2025, 4, 30, 15, 0),
   details: {
     paciente: 'Natalia Jiménez Ortega',
     tipo: 'Psicoterapia',
     sala: 'Consultorio de Psicología',
     estado: 'Confirmada',
     observaciones: 'Ansiedad post-accidente - terapia cognitiva'
   }
 },
 {
   id: 13,
   title: 'Evaluación Funcional',
   start: new Date(2025, 4, 31, 8, 0),
   end: new Date(2025, 4, 31, 9, 30),
   details: {
     paciente: 'Diego Castillo Romero',
     tipo: 'Evaluación inicial',
     sala: 'Sala de Evaluación',
     estado: 'Pendiente',
     observaciones: 'Primera consulta - lesión deportiva rodilla'
   }
 },
 {
   id: 14,
   title: 'Terapia Grupal',
   start: new Date(2025, 4, 31, 16, 0),
   end: new Date(2025, 4, 31, 17, 0),
   details: {
     paciente: 'Grupo Adultos Mayores',
     tipo: 'Actividad grupal',
     sala: 'Salón Multiusos',
     estado: 'Confirmada',
     observaciones: 'Ejercicios de equilibrio y coordinación - 8 participantes'
   }
 }
];