import ScreenView from "@/components/Screen";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScreenView
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top + 60 }}
    >
      <ScrollView className="flex-1 px-6">
        <Text className="text-gray-900 text-base leading-6 mb-4">
          Última actualización: {new Date().toLocaleDateString()}
        </Text>

        <Text className="text-gray-900 text-base leading-6 mb-6">
          La presente Política de Privacidad describe cómo HealthUnity
          recolecta, utiliza, almacena y protege la información personal de sus
          usuarios. Al utilizar nuestra aplicación, usted acepta los términos
          descritos en este documento.
        </Text>

        {/* 1. Responsable */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            1. Responsable del Tratamiento de Datos
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Responsable: HealthUnity (empresa){"\n"}• Ubicación: Barranquilla,
            Colombia{"\n"}• Correo: healthunity@nextgeninnovators@gmail.com
            {"\n\n"}
            HealthUnity cumple con la Ley 1581 de 2012 y demás normas
            colombianas de protección de datos personales.
          </Text>
        </View>

        {/* 2. Información recolectada */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            2. Información que Recolectamos
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-3">
            La aplicación solicita y almacena los siguientes datos personales:
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Nombre y Apellido
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Número de teléfono
          </Text>
          <Text className="text-gray-700 text-base leading-6">• Dirección</Text>
          <Text className="text-gray-700 text-base leading-6">
            • Correo electrónico
          </Text>
          <Text className="text-gray-700 text-base leading-6">• Género</Text>
          <Text className="text-gray-700 text-base leading-6 mb-2">
            • Fecha de nacimiento
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-2">
            También puede solicitar acceso a la ubicación aproximada o precisa
            del dispositivo.
          </Text>
          <Text className="text-gray-700 text-base leading-6 font-medium">
            No recolectamos datos médicos, historial clínico ni información
            sensible de salud.
          </Text>
        </View>

        {/* 3. Finalidad */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            3. Finalidad del Tratamiento
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            La información recolectada se utiliza para:
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Crear y administrar la cuenta del usuario
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Permitir la reserva y gestión de citas
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Enviar notificaciones y recordatorios
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-2">
            • Mejorar la experiencia y funcionamiento de la aplicación
          </Text>
          <Text className="text-gray-700 text-base leading-6 font-medium">
            No utilizamos los datos para publicidad ni venta de información.
          </Text>
        </View>

        {/* 4. Almacenamiento */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            4. Almacenamiento de los Datos
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            Los datos se almacenan en una base de datos propia administrada por
            HealthUnity, con medidas de seguridad para evitar accesos no
            autorizados, pérdida o alteración.
          </Text>
        </View>

        {/* 5. Compartición */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            5. Compartición de Datos
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            No compartimos, vendemos ni transferimos información personal a
            terceros. Solo se accederá a los datos si:
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Es necesario para el funcionamiento interno
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Lo requiere una autoridad legal competente
          </Text>
        </View>

        {/* 6. Derechos */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            6. Derechos del Usuario
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-3">
            El usuario puede en cualquier momento:
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Editar sus datos
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Solicitar copia de su información
          </Text>
          <Text className="text-gray-700 text-base leading-6 mb-2">
            • Eliminar su cuenta y datos definitivamente
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            Para ejercer estos derechos, escriba a: {"\n"}
            healthunity@nextgeninnovators@gmail.com
          </Text>
        </View>

        {/* 7. Uso Local */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            7. Uso Local de la Aplicación
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            HealthUnity está destinada para uso en la ciudad de Barranquilla,
            Colombia. Si en el futuro se extiende a otras regiones, esta
            política podrá ser ajustada.
          </Text>
        </View>

        {/* 8. Cambios */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            8. Cambios en la Política de Privacidad
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            HealthUnity podrá modificar esta Política en cualquier momento. Se
            notificará a los usuarios cuando sea pertinente.
          </Text>
        </View>

        {/* 9. Aceptación */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            9. Aceptación
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            Al usar la aplicación, el usuario reconoce haber leído y aceptado
            esta Política de Privacidad.
          </Text>
        </View>
      </ScrollView>
    </ScreenView>
  );
}
