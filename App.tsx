import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import getCurrency from 'services/currencyService';
import './global.css';
import currency from "currency-codes";

export default function App() {

  type Currency = {
    code: string;
    value: number;
  };

  type CurrencyData = {
    [key: string]: Currency; 
  };

  const [currencyData, setCurrencyData] = useState<CurrencyData | null>(null);

  const [amount, setAmount] = useState<string>("");
  const [target, setTarget] = useState<string>("USD");
  const [mode, setMode] = useState<"MGA_TO_DEV" | "DEV_TO_MGA">("MGA_TO_DEV");  
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    getCurrency()
      .then((response: any) => {
        setCurrencyData(response.data);
      })
      .catch((error: any) => console.error(error));
  }, []);

  if (!currencyData) return <Text>Chargement...</Text>;

  const mga = currencyData["MGA"];
  const targetCurrency = currencyData[target];

  // Fonction de conversion
  const convert = () => {
    const amountNum = Number(amount);
    if (!amountNum) return;

    let resultValue = 0;

    if (mode === "MGA_TO_DEV") {
      // MGA → Devise
      resultValue = (amountNum / mga.value) * targetCurrency.value;
    } else {
      // Devise → MGA
      resultValue = (amountNum / targetCurrency.value) * mga.value;
    }

    setResult(resultValue);
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-200 p-6">

      <Text className="text-xl font-bold mb-4">Convertisseur</Text>

      {/* --- MODE SWITCH --- */}
      <TouchableOpacity
        onPress={() =>
          setMode(mode === "MGA_TO_DEV" ? "DEV_TO_MGA" : "MGA_TO_DEV")
        }
        className="bg-purple-600 px-4 py-2 rounded mb-4"
      >
        <Text className="text-white font-bold">
          {mode === "MGA_TO_DEV"
            ? "Mode actuel : MGA → Devise (cliquer pour inverser)"
            : "Mode actuel : Devise → MGA (cliquer pour inverser)"}
        </Text>
      </TouchableOpacity>

      {/* --- MONTANT --- */}
      <View className="mb-3 w-64">
        <Text className="mb-1">
          {mode === "MGA_TO_DEV" ? "Montant en MGA :" : `Montant en ${target} :`}
        </Text>

        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          className="w-full p-2 bg-white rounded"
        />
      </View>

      {/* --- CHOIX DEVISE CIBLE --- */}
      <View className="mb-3 w-64">
        <Text className="mb-1">Devise :</Text>
        <Picker
          selectedValue={target}
          onValueChange={(val) => setTarget(val)}
          style={{ backgroundColor: "white" }}
        >
          {Object.keys(currencyData).map((code) => (
            <Picker.Item key={code} label={currency.code(code)?.currency ?? code} value={code} />
          ))}
        </Picker>
      </View>

      {/* --- BOUTON CONVERTIR --- */}
      <Text
        onPress={convert}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Convertir
      </Text>

      {/* --- RÉSULTAT --- */}
      {result !== null && (
        <Text className="text-lg font-bold">
          <Text className="text-lg font-bold">
            Résultat :{" "}
            {new Intl.NumberFormat("fr-FR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4
            }).format(result || 0)}
          </Text>
        </Text>
      )}
    </View>
  );
}
