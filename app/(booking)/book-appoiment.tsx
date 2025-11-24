import ScreenView from "@/components/Screen";
import { Doctor } from "@/types/doctorResponse";
import { Link, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { Calendar, Clock, MapPin, Shield, Star } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Horarios {
  horaInicio: string;
  horaFin: string;
}
interface Dias {
  diaSemana: number;
  horarios: Horarios[];
}
interface HorarioDoctor {
  idDoctor: number;
  dias: Dias[];
}
interface Cita {
  idCita: string;
  fecha: string;
  hora: string;
  estado: string;
}

const obtenerDiasLaborables = () => {
  const hoy = new Date();
  const diasLaborables = [];
  const nombresDias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const diaActual = hoy.getDay();

  let diasHastaSabado;
  if (diaActual === 0) {
    diasHastaSabado = 6;
  } else if (diaActual === 6) {
    diasHastaSabado = 7;
  } else {
    diasHastaSabado = 6 - diaActual;
  }

  for (let i = 0; i <= diasHastaSabado; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    const diaSemana = fecha.getDay();

    if (diaSemana !== 0) {
      diasLaborables.push({
        day: fecha.getDate().toString(),
        date: nombresDias[diaSemana],
        fechaCompleta: fecha.toISOString().split("T")[0],
        diaSemanaNumero: diaSemana,
        esHoy: i === 0 && diaSemana !== 0,
        mes: fecha.getMonth(),
        año: fecha.getFullYear(),
      });
    }
  }
  return diasLaborables;
};

const horaAMinutos = (hora: string): number => {
  const [horas, minutos] = hora.split(":").map(Number);
  return horas * 60 + minutos;
};

const minutosAHora12 = (minutos: number): string => {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  const periodo = horas >= 12 ? "PM" : "AM";
  const horas12 = horas % 12 || 12;
  return `${horas12}:${mins.toString().padStart(2, "0")} ${periodo}`;
};

const hora12AMinutos = (hora: string): number => {
  const [tiempo, periodo] = hora.split(" ");
  let [horas, minutos] = tiempo.split(":").map(Number);

  if (periodo === "PM" && horas !== 12) {
    horas += 12;
  } else if (periodo === "AM" && horas === 12) {
    horas = 0;
  }

  return horas * 60 + minutos;
};

const horaYaPaso = (horaSlot: string, fechaSeleccionada: string): boolean => {
  const hoy = new Date();
  const fechaHoy = hoy.toISOString().split("T")[0];

  if (fechaSeleccionada !== fechaHoy) {
    return false;
  }

  const horaActualMinutos = hoy.getHours() * 60 + hoy.getMinutes();
  const slotMinutos = hora12AMinutos(horaSlot);

  return slotMinutos <= horaActualMinutos;
};

const generarSlots = (horaInicio: string, horaFin: string): string[] => {
  const inicio = horaAMinutos(horaInicio);
  const fin = horaAMinutos(horaFin);
  const slots: string[] = [];
  for (let minutos = inicio; minutos < fin; minutos += 30) {
    slots.push(minutosAHora12(minutos));
  }
  return slots;
};

export default function BookAppointment() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";
  const insets = useSafeAreaInsets();
  const { idDoctor, isReprogramacion, idCita, fechaActual, horaActual } =
    useLocalSearchParams();

  const [dates, setDates] = useState<
    {
      day: string;
      date: string;
      fechaCompleta: string;
      diaSemanaNumero: number;
      esHoy: boolean;
      mes: number;
      año: number;
    }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [horarioDoctor, setHorarioDoctor] = useState<HorarioDoctor | null>(
    null
  );
  const [citasDoctor, setCitasDoctor] = useState<Cita[]>([]);
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHoras, setLoadingHoras] = useState(false);
  const [gmail, setGmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const esReprogramacion = isReprogramacion === "true";

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = await SecureStore.getItemAsync("access_token");
        const id_token = await SecureStore.getItemAsync("id_token");
        if (!token) {
          throw new Error("No token found");
        }
        if (!id_token) {
          throw new Error("No id_token found");
        }
        const decoded: { email: string } = jwtDecode(id_token) as {
          email: string;
        };
        setGmail(decoded.email);
        setLoading(true);

        const response = await fetch(
          `${apiUrl}/api/v1/doctor/getDoctorById?idDoctor=${idDoctor}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error al obtener los datos del doctor");
        }
        const data = await response.json();
        setDoctorData(data);

        const horarioResponse = await fetch(
          `${apiUrl}/api/v1/doctor/getHorarioDoctor?idDoctor=${idDoctor}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (horarioResponse.ok) {
          const horarioData = await horarioResponse.json();
          setHorarioDoctor(horarioData);
        }

        const citasResponse = await fetch(
          `${apiUrl}/api/v1/citas/getCitasByDoctor?idDoctor=${idDoctor}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (citasResponse.ok) {
          const citasData = await citasResponse.json();
          setCitasDoctor(citasData);
        }

        setError(null);
      } catch (err: unknown) {
        console.error("Error fetching doctor:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    if (idDoctor) {
      fetchDoctorData();
    }
  }, [idDoctor]);

  useEffect(() => {
    const diasLaborables = obtenerDiasLaborables();
    setDates(diasLaborables);

    // Si es reprogramación, seleccionar la fecha actual de la cita
    if (esReprogramacion && fechaActual) {
      const fechaActualStr = Array.isArray(fechaActual)
        ? fechaActual[0]
        : fechaActual;
      const diaActual = diasLaborables.find(
        (d) => d.fechaCompleta === fechaActualStr
      );
      if (diaActual) {
        setSelectedDate(diaActual.day);
      } else if (diasLaborables.length > 0) {
        setSelectedDate(diasLaborables[0].day);
      }
    } else if (diasLaborables.length > 0) {
      setSelectedDate(diasLaborables[0].day);
    }
  }, [esReprogramacion, fechaActual]);

  useEffect(() => {
    if (!selectedDate || !horarioDoctor) return;

    setLoadingHoras(true);

    const fechaSeleccionada = dates.find((d) => d.day === selectedDate);
    if (!fechaSeleccionada) {
      setLoadingHoras(false);
      return;
    }

    const diaHorario = horarioDoctor.dias?.find(
      (dia) => dia.diaSemana === fechaSeleccionada.diaSemanaNumero
    );

    if (
      !diaHorario ||
      !diaHorario.horarios ||
      diaHorario.horarios.length === 0
    ) {
      setHorasDisponibles([]);
      setLoadingHoras(false);
      return;
    }

    let todosLosSlots: string[] = [];
    diaHorario.horarios.forEach((horario) => {
      const slots = generarSlots(horario.horaInicio, horario.horaFin);
      todosLosSlots = [...todosLosSlots, ...slots];
    });

    todosLosSlots = [...new Set(todosLosSlots)];

    const citasDelDia = citasDoctor.filter(
      (cita) =>
        cita.fecha === fechaSeleccionada.fechaCompleta &&
        (cita.estado === "confirmada" || cita.estado === "pendiente")
    );

    const horasOcupadas = citasDelDia.map((cita) => {
      const minutos = horaAMinutos(cita.hora);
      return minutosAHora12(minutos);
    });

    const slotsDisponibles = todosLosSlots.filter(
      (slot) =>
        !horasOcupadas.includes(slot) &&
        !horaYaPaso(slot, fechaSeleccionada.fechaCompleta)
    );

    setHorasDisponibles(slotsDisponibles);

    // Si es reprogramación y la hora actual está disponible, seleccionarla
    if (esReprogramacion && horaActual) {
      const horaActualStr = Array.isArray(horaActual)
        ? horaActual[0]
        : horaActual;
      const minutos = horaAMinutos(horaActualStr);
      const horaFormateada = minutosAHora12(minutos);

      if (slotsDisponibles.includes(horaFormateada)) {
        setSelectedTime(horaFormateada);
      } else if (slotsDisponibles.length > 0) {
        setSelectedTime(slotsDisponibles[0]);
      } else {
        setSelectedTime("");
      }
    } else if (
      slotsDisponibles.length > 0 &&
      !slotsDisponibles.includes(selectedTime)
    ) {
      setSelectedTime(slotsDisponibles[0]);
    } else if (slotsDisponibles.length === 0) {
      setSelectedTime("");
    }

    setLoadingHoras(false);
  }, [
    selectedDate,
    horarioDoctor,
    citasDoctor,
    dates,
    esReprogramacion,
    horaActual,
  ]);

  const morningTimes = horasDisponibles.filter((time) => time.includes("AM"));
  const afternoonTimes = horasDisponibles.filter((time) => time.includes("PM"));

  const obtenerFechaFormateada = () => {
    const fechaSeleccionada = dates.find((d) => d.day === selectedDate);
    if (!fechaSeleccionada) return "Selecciona una fecha";
    const meses = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    return `${fechaSeleccionada.date}, ${fechaSeleccionada.day} ${meses[fechaSeleccionada.mes]} ${fechaSeleccionada.año}`;
  };

  if (loading) {
    return (
      <ScreenView
        className="flex-1 bg-white"
        style={{ paddingTop: insets.top + 60 }}
      >
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-600 mt-4">Cargando información...</Text>
        </View>
      </ScreenView>
    );
  }

  if (error) {
    return (
      <ScreenView
        className="flex-1 bg-white"
        style={{ paddingTop: insets.top + 60 }}
      >
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-red-500 text-center">Error: {error}</Text>
        </View>
      </ScreenView>
    );
  }

  return (
    <ScreenView
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top + 60 }}
    >
      <ScrollView className="flex-1">
        {/* Indicador de Reprogramación */}
        {esReprogramacion && (
          <View className="mx-6 mb-4 bg-blue-50 rounded-xl p-4">
            <Text className="text-blue-700 font-semibold text-center">
              Reprogramando Cita
            </Text>
            <Text className="text-blue-600 text-sm text-center mt-1">
              Selecciona la nueva fecha y hora para tu cita
            </Text>
          </View>
        )}

        {/* Doctor Info */}
        {doctorData && (
          <View className="mx-6 mb-6">
            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <View className="flex-row items-start">
                <Image
                  source={{ uri: doctorData.detallesUsuario.urlImagen }}
                  className="w-16 h-16 rounded-full mr-4"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Shield size={14} color="#3B82F6" />
                    <Text className="text-blue-500 text-xs ml-1">
                      Doctor Profesional
                    </Text>
                  </View>
                  <Text className="font-semibold text-gray-900 mb-1">
                    Dr. {doctorData.detallesUsuario.nombre}{" "}
                    {doctorData.detallesUsuario.apellido}
                  </Text>
                  <Text className="text-gray-500 text-sm mb-2">
                    {doctorData.especialidad.nombre}
                  </Text>
                  <View className="flex-row items-center">
                    <Star size={14} color="#FFA500" fill="#FFA500" />
                    <Text className="text-sm text-gray-600 ml-1">
                      {doctorData.experiencia} años de experiencia
                    </Text>
                  </View>
                </View>
              </View>
              {doctorData.detalles && (
                <View className="mt-3 pt-3 border-t border-gray-100">
                  <Text className="text-gray-600 text-sm">
                    {doctorData.detalles}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Date Selection */}
        <View className="mx-6 mb-6">
          <Text className="text-lg font-semibold mb-4">Seleccionar Fecha</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3">
              {dates.map((date) => {
                const trabajaEsteDia =
                  horarioDoctor?.dias?.some(
                    (dia) => dia.diaSemana === date.diaSemanaNumero
                  ) || false;
                return (
                  <Pressable
                    key={date.fechaCompleta}
                    onPress={() => trabajaEsteDia && setSelectedDate(date.day)}
                    disabled={!trabajaEsteDia}
                    className={`px-4 py-3 rounded-xl items-center min-w-[60px] ${
                      selectedDate === date.day
                        ? "bg-blue-500"
                        : trabajaEsteDia
                          ? "bg-gray-100"
                          : "bg-gray-50 opacity-50"
                    } ${date.esHoy ? "border-2 border-blue-300" : ""}`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedDate === date.day
                          ? "text-white"
                          : trabajaEsteDia
                            ? "text-gray-600"
                            : "text-gray-400"
                      }`}
                    >
                      {date.date}
                    </Text>
                    <Text
                      className={`text-lg font-semibold ${
                        selectedDate === date.day
                          ? "text-white"
                          : trabajaEsteDia
                            ? "text-gray-900"
                            : "text-gray-400"
                      }`}
                    >
                      {date.day}
                    </Text>
                    {date.esHoy && (
                      <Text
                        className={`text-xs ${
                          selectedDate === date.day
                            ? "text-white"
                            : "text-blue-500"
                        }`}
                      >
                        Hoy
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View className="mx-6 mb-6">
          <Text className="text-lg font-semibold mb-4">Seleccionar Hora</Text>
          {loadingHoras ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text className="text-gray-500 mt-2">Cargando horarios...</Text>
            </View>
          ) : horasDisponibles.length === 0 ? (
            <View className="py-8 items-center bg-gray-50 rounded-xl">
              <Text className="text-gray-500">
                No hay horarios disponibles para este día
              </Text>
            </View>
          ) : (
            <>
              {morningTimes.length > 0 && (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-600 mb-2">
                    Mañana
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {morningTimes.map((time) => (
                      <Pressable
                        key={time}
                        onPress={() => setSelectedTime(time)}
                        className={`px-4 py-2 rounded-lg ${
                          selectedTime === time ? "bg-blue-500" : "bg-gray-100"
                        }`}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            selectedTime === time
                              ? "text-white"
                              : "text-gray-600"
                          }`}
                        >
                          {time}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              {afternoonTimes.length > 0 && (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-600 mb-2">
                    Tarde
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {afternoonTimes.map((time) => (
                      <Pressable
                        key={time}
                        onPress={() => setSelectedTime(time)}
                        className={`px-4 py-2 rounded-lg ${
                          selectedTime === time ? "bg-blue-500" : "bg-gray-100"
                        }`}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            selectedTime === time
                              ? "text-white"
                              : "text-gray-600"
                          }`}
                        >
                          {time}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
            </>
          )}
        </View>

        {/* Appointment Details */}
        {selectedTime && (
          <View className="mx-6 mb-6">
            <Text className="text-lg font-semibold mb-4">
              Detalles de la Cita
            </Text>
            <View className="bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center mb-2">
                <Calendar size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-2">
                  {obtenerFechaFormateada()}
                </Text>
              </View>
              <View className="flex-row items-center mb-2">
                <Clock size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-2">{selectedTime}</Text>
              </View>
              {doctorData && (
                <View className="flex-row items-center">
                  <MapPin size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-2">
                    Consulta de {doctorData.especialidad.nombre}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Book Button */}
      <View className="px-6 pb-6">
        <Link
          href={{
            pathname: "/patient-details",
            params: {
              gmail: gmail,
              idDoctor: idDoctor,
              doctorName: doctorData
                ? `${doctorData.detallesUsuario.nombre} ${doctorData.detallesUsuario.apellido}`
                : "",
              especialidad: doctorData?.especialidad.nombre || "",
              fecha:
                dates.find((d) => d.day === selectedDate)?.fechaCompleta || "",
              fechaFormateada: obtenerFechaFormateada(),
              hora: selectedTime,
              urlImagen: doctorData?.detallesUsuario.urlImagen,
              isReprogramacion: esReprogramacion ? "true" : "false",
              idCita: idCita || "",
            },
          }}
          asChild
        >
          <Pressable
            className={`py-4 rounded-full ${
              selectedTime ? "bg-blue-500" : "bg-gray-300"
            }`}
            disabled={!selectedTime}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {esReprogramacion ? "Continuar Reprogramación" : "Reservar Cita"}
            </Text>
          </Pressable>
        </Link>
      </View>
    </ScreenView>
  );
}
