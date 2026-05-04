import React, { useMemo, useState } from "react";
import { Keyboard, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Briefcase, Send, Sparkles } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LocationFields from "@/components/LocationFields";
import { freelancerCategories } from "@/data/freelancersData";
import { getDefaultDistrict } from "@/data/mozambiqueLocationsData";
import { mabassaApi } from "@/utils/api";
import { useAuth } from "@/utils/auth/useAuth";
import { logError } from "@/utils/logger";

const BLUE = "#2563EB";
const BG = "#F8FAFC";

const inputStyle = {
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#E2E8F0",
  borderRadius: 14,
  paddingHorizontal: 14,
  paddingVertical: 13,
  minHeight: 52,
  fontSize: 14,
  color: "#0F172A",
};

const multilineStyle = {
  ...inputStyle,
  minHeight: 120,
  textAlignVertical: "top",
};

const categoryOptions = freelancerCategories.filter((category) => category !== "Todos");
const DEFAULT_PROVINCE = "Cidade de Maputo";

export default function CreateContentScreen({ type }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { auth } = useAuth();
  const user = auth?.user;
  const token = auth?.accessToken;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    content: "",
    title: "",
    description: "",
    category: "",
    price: "",
    requirements: "",
    salary_min: "",
    salary_max: "",
    province: user?.province || DEFAULT_PROVINCE,
    city: user?.city || getDefaultDistrict(user?.province || DEFAULT_PROVINCE),
  });

  const meta = useMemo(() => {
    if (type === "service") {
      return {
        title: "Publicar servico",
        subtitle: "Mostre o que voce oferece no Mabassa.",
        icon: Sparkles,
      };
    }
    if (type === "job") {
      return {
        title: "Publicar vaga",
        subtitle: "Encontre candidatos para a sua empresa.",
        icon: Briefcase,
      };
    }
    return {
      title: "Criar post",
      subtitle: "Partilhe uma atualizacao profissional.",
      icon: Send,
    };
  }, [type]);

  const Icon = meta.icon;

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    Keyboard.dismiss();
    if (!user?.id) {
      setError("Entre na sua conta para publicar.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      if (type === "post") {
        await mabassaApi.createPost(
          {
            author_id: user.id,
            content: form.content.trim(),
          },
          token
        );
        queryClient.invalidateQueries({ queryKey: ["feed"] });
      }

      if (type === "service") {
        await mabassaApi.createService(
          {
            owner_user_id: user.id,
            owner_type: user.user_type === "empresa" ? "empresa" : "freelancer",
            title: form.title.trim(),
            description: form.description.trim(),
            category: form.category.trim() || null,
            price: form.price ? Number(form.price) : null,
            province: form.province.trim() || null,
            city: form.city.trim() || null,
          },
          token
        );
        queryClient.invalidateQueries({ queryKey: ["feed"] });
      }

      if (type === "job") {
        await mabassaApi.createJob(
          {
            company_user_id: user.id,
            title: form.title.trim(),
            description: form.description.trim(),
            requirements: form.requirements.trim() || null,
            salary_min: form.salary_min ? Number(form.salary_min) : null,
            salary_max: form.salary_max ? Number(form.salary_max) : null,
            province: form.province.trim() || null,
            city: form.city.trim() || null,
            job_type: "full_time",
          },
          token
        );
        queryClient.invalidateQueries({ queryKey: ["feed"] });
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
      }

      router.back();
    } catch (submitError) {
      logError(`create-${type}`, submitError);
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: BG, paddingTop: insets.top }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#0F172A" }}>
            {meta.title}
          </Text>
          <Text style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>
            {meta.subtitle}
          </Text>
        </View>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: BLUE,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={19} color="#fff" />
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: insets.bottom + 24 }}
      >
        {type === "post" ? (
          <TextInput
            value={form.content}
            onChangeText={(value) => update("content", value)}
            placeholder="O que quer partilhar?"
            multiline
            style={multilineStyle}
          />
        ) : (
          <>
            <TextInput
              value={form.title}
              onChangeText={(value) => update("title", value)}
              placeholder={type === "job" ? "Titulo da vaga" : "Titulo do servico"}
              style={inputStyle}
            />
            <TextInput
              value={form.description}
              onChangeText={(value) => update("description", value)}
              placeholder="Descricao"
              multiline
              style={multilineStyle}
            />
            {type === "service" ? (
              <>
                <View style={[inputStyle, { paddingHorizontal: 0, paddingVertical: 0 }]}>
                  <Picker
                    selectedValue={form.category}
                    onValueChange={(value) => update("category", value)}
                    style={{ color: form.category ? "#0F172A" : "#94A3B8", minHeight: 52 }}
                  >
                    <Picker.Item label="Categoria" value="" />
                    {categoryOptions.map((category) => (
                      <Picker.Item key={category} label={category} value={category} />
                    ))}
                  </Picker>
                </View>
                <TextInput
                  value={form.price}
                  onChangeText={(value) => update("price", value)}
                  placeholder="Preco"
                  keyboardType="numeric"
                  style={inputStyle}
                />
              </>
            ) : (
              <>
                <TextInput
                  value={form.requirements}
                  onChangeText={(value) => update("requirements", value)}
                  placeholder="Requisitos, separados por virgula"
                  style={inputStyle}
                />
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TextInput
                    value={form.salary_min}
                    onChangeText={(value) => update("salary_min", value)}
                    placeholder="Salario min"
                    keyboardType="numeric"
                    style={[inputStyle, { flex: 1 }]}
                  />
                  <TextInput
                    value={form.salary_max}
                    onChangeText={(value) => update("salary_max", value)}
                    placeholder="Salario max"
                    keyboardType="numeric"
                    style={[inputStyle, { flex: 1 }]}
                  />
                </View>
              </>
            )}
            <LocationFields
              province={form.province}
              city={form.city}
              onProvinceChange={(value) => update("province", value)}
              onCityChange={(value) => update("city", value)}
              inputStyle={inputStyle}
            />
          </>
        )}

        {error && <Text style={{ color: "#DC2626", fontSize: 13 }}>{error}</Text>}

        <TouchableOpacity
          onPress={submit}
          disabled={submitting}
          style={{
            backgroundColor: BLUE,
            minHeight: 54,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            opacity: submitting ? 0.65 : 1,
            marginTop: 4,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 15, fontWeight: "800" }}>
            {submitting ? "Publicando..." : "Publicar"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
