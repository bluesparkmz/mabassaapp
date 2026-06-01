import React, { useMemo, useState } from "react";
import { Keyboard, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Briefcase, ImagePlus, Send, Sparkles, Trash2, Type } from "lucide-react-native";
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

const postModeButtonStyle = (active) => ({
  flex: 1,
  minHeight: 44,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: active ? BLUE : "#CBD5E1",
  backgroundColor: active ? "#EFF6FF" : "#FFFFFF",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  gap: 8,
});

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
  const [postMode, setPostMode] = useState("text");
  const [selectedImage, setSelectedImage] = useState(null);
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

  const changePostMode = (mode) => {
    setPostMode(mode);
    setError(null);
    if (mode === "text") {
      setSelectedImage(null);
    }
  };

  const pickPostImage = async () => {
    setError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Permita acesso a galeria para escolher uma imagem.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (!result.canceled && result.assets?.[0]) {
      setSelectedImage(result.assets[0]);
      setPostMode("image");
    }
  };

  const uploadSelectedImage = async () => {
    const formData = new FormData();
    const fileName = selectedImage.fileName || `post-${Date.now()}.jpg`;
    const mimeType = selectedImage.mimeType || "image/jpeg";
    formData.append("file", {
      uri: selectedImage.uri,
      name: fileName,
      type: mimeType,
    });
    const uploaded = await mabassaApi.uploadPostImage(formData, token);
    return uploaded.image_url;
  };

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
        const content = form.content.trim();
        if (postMode === "image") {
          if (!selectedImage?.uri) {
            setError("Escolha uma imagem para publicar.");
            setSubmitting(false);
            return;
          }
          const imageUrl = await uploadSelectedImage();
          await mabassaApi.createPost(
            {
              author_id: user.id,
              post_type: "image",
              content: content || null,
              image_url: imageUrl,
            },
            token
          );
        } else {
          if (!content) {
            setError("Escreva alguma coisa para publicar.");
            setSubmitting(false);
            return;
          }
          await mabassaApi.createPost(
            {
              author_id: user.id,
              post_type: "text",
              content,
            },
            token
          );
        }
        queryClient.invalidateQueries({ queryKey: ["feed"] });
      }

      if (type === "service") {
        let imageUrl = null;
        if (selectedImage?.uri) {
          imageUrl = await uploadSelectedImage();
        }
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
            image_url: imageUrl,
          },
          token
        );
        queryClient.invalidateQueries({ queryKey: ["feed"] });
      }

      if (type === "job") {
        let imageUrl = null;
        if (selectedImage?.uri) {
          imageUrl = await uploadSelectedImage();
        }
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
            image_url: imageUrl,
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
          <>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => changePostMode("text")}
                activeOpacity={0.75}
                style={postModeButtonStyle(postMode === "text")}
              >
                <Type size={17} color={postMode === "text" ? BLUE : "#64748B"} />
                <Text
                  style={{
                    color: postMode === "text" ? BLUE : "#475569",
                    fontSize: 13,
                    fontWeight: "800",
                  }}
                >
                  Texto
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => changePostMode("image")}
                activeOpacity={0.75}
                style={postModeButtonStyle(postMode === "image")}
              >
                <ImagePlus size={17} color={postMode === "image" ? BLUE : "#64748B"} />
                <Text
                  style={{
                    color: postMode === "image" ? BLUE : "#475569",
                    fontSize: 13,
                    fontWeight: "800",
                  }}
                >
                  Imagem
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              value={form.content}
              onChangeText={(value) => update("content", value)}
              placeholder={
                postMode === "image" ? "Escreva uma legenda opcional..." : "O que quer partilhar?"
              }
              multiline
              style={[
                multilineStyle,
                {
                  minHeight: postMode === "image" ? 92 : 140,
                  borderColor: "#CBD5E1",
                },
              ]}
            />

            {postMode === "image" && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: selectedImage ? "#CBD5E1" : "#BFDBFE",
                  borderStyle: selectedImage ? "solid" : "dashed",
                  borderRadius: 16,
                  backgroundColor: selectedImage ? "#FFFFFF" : "#EFF6FF",
                  overflow: "hidden",
                }}
              >
                {selectedImage ? (
                  <>
                    <Image
                      source={{ uri: selectedImage.uri }}
                      style={{ width: "100%", height: 220 }}
                      contentFit="cover"
                    />
                    <View
                      style={{
                        padding: 12,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={pickPostImage}
                        activeOpacity={0.75}
                        style={{
                          flex: 1,
                          minHeight: 44,
                          borderRadius: 12,
                          backgroundColor: "#EEF2FF",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "row",
                          gap: 8,
                        }}
                      >
                        <ImagePlus size={17} color={BLUE} />
                        <Text style={{ color: BLUE, fontSize: 13, fontWeight: "800" }}>
                          Trocar imagem
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setSelectedImage(null)}
                        activeOpacity={0.75}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          backgroundColor: "#FEF2F2",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={17} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <TouchableOpacity
                    onPress={pickPostImage}
                    activeOpacity={0.75}
                    style={{
                      minHeight: 168,
                      padding: 18,
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <View
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 14,
                        backgroundColor: "#DBEAFE",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ImagePlus size={22} color={BLUE} />
                    </View>
                    <Text style={{ fontSize: 15, fontWeight: "800", color: "#0F172A" }}>
                      Escolher imagem
                    </Text>
                    <Text style={{ fontSize: 12, color: "#64748B", textAlign: "center" }}>
                      JPG, PNG, WebP ou HEIC ate 5MB
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
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

            {/* Image selector for service and job */}
            <View
              style={{
                borderWidth: 1,
                borderColor: selectedImage ? "#CBD5E1" : "#BFDBFE",
                borderStyle: selectedImage ? "solid" : "dashed",
                borderRadius: 16,
                backgroundColor: selectedImage ? "#FFFFFF" : "#EFF6FF",
                overflow: "hidden",
              }}
            >
              {selectedImage ? (
                <>
                  <Image
                    source={{ uri: selectedImage.uri }}
                    style={{ width: "100%", height: 200 }}
                    contentFit="cover"
                  />
                  <View
                    style={{
                      padding: 12,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={pickPostImage}
                      activeOpacity={0.75}
                      style={{
                        flex: 1,
                        minHeight: 44,
                        borderRadius: 12,
                        backgroundColor: "#EEF2FF",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                        gap: 8,
                      }}
                    >
                      <ImagePlus size={17} color={BLUE} />
                      <Text style={{ color: BLUE, fontSize: 13, fontWeight: "800" }}>
                        Trocar imagem
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setSelectedImage(null)}
                      activeOpacity={0.75}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: "#FEF2F2",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Trash2 size={17} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <TouchableOpacity
                  onPress={pickPostImage}
                  activeOpacity={0.75}
                  style={{
                    minHeight: 140,
                    padding: 18,
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      backgroundColor: "#DBEAFE",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ImagePlus size={22} color={BLUE} />
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: "800", color: "#0F172A" }}>
                    Escolher imagem (opcional)
                  </Text>
                  <Text style={{ fontSize: 12, color: "#64748B", textAlign: "center" }}>
                    JPG, PNG, WebP ou HEIC ate 5MB
                  </Text>
                </TouchableOpacity>
              )}
            </View>

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
