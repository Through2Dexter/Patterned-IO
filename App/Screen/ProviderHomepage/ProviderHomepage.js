import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../../Assets/supabase.js";
import Colors from "../../Utils/Colors";

export default function ProviderHomepage() {
  const [providerData, setProviderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await supabase.auth.getSession();
        if (!session?.data?.session?.user) {
          console.warn("User is not logged in");
          return;
        }

        const user = session.data.session.user;
        const { data, error } = await supabase
          .from("service_providers")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;
        setProviderData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching provider data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigation.navigate("LoginScreen");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return Colors.GREEN;
    if (score >= 50) return Colors.YELLOW;
    return Colors.RED;
  };

  const handleAddImage = async () => {
    const session = await supabase.auth.getSession();
    if (!session?.data?.session?.user) {
      alert("You must be logged in to upload images.");
      return;
    }

    const user = session.data.session.user;

    const { data: providerData, error } = await supabase
      .from("service_providers")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error || !providerData) {
      alert(
        "You are not a service provider or you're not authorized to upload images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      handleUploadImage(result.assets[0].uri, providerData);
    }
  };

  const handleUploadImage = async (uri, providerData) => {
    if (!uri) return;

    try {
      setUploading(true);

      const response = await fetch(uri);
      const blob = await response.blob();

      const filePath = `gallery/${Date.now()}.png`;

      const { data, error } = await supabase.storage
        .from("gallery")
        .upload(filePath, blob, { upsert: true });

      if (error) {
        alert("Error uploading image: " + error.message);
        throw error;
      }

      const publicURL = supabase.storage
        .from("gallery")
        .getPublicUrl(data.path).publicURL;

      const updatedGallery = providerData.gallery
        ? [...providerData.gallery, publicURL]
        : [publicURL];

      const { data: updatedProviderData, error: updateError } = await supabase
        .from("service_providers")
        .update({ gallery: updatedGallery })
        .eq("user_id", providerData.user_id)
        .single();

      if (updateError) {
        alert("Failed to update gallery.");
        return;
      }

      setProviderData(updatedProviderData);
      setUploading(false);
    } catch (error) {
      alert("Failed to upload image: " + error.message);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </SafeAreaView>
    );
  }

  if (!providerData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>
          Failed to load provider data. Please try again later.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.profileImageWrapper}>
            <Image
              source={{ uri: providerData.profile_picture }}
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.addIconContainer}
              onPress={handleAddImage}
              disabled={uploading}
            >
              <Text style={styles.addIconText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.name}>{providerData.business_name}</Text>
            <Text
              style={[
                styles.reliability,
                { color: getScoreColor(providerData.reliability_score) },
              ]}
            >
              {providerData.reliability_score}
            </Text>
            <Text style={styles.service}>{providerData.service}</Text>
          </View>
        </View>

        <View style={styles.servicesSection}>
          {providerData.services?.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDescription}>
                {service.description}
              </Text>
              <Text style={styles.serviceDetails}>${service.price}</Text>
            </View>
          ))}
        </View>

        <View style={styles.servicesButtonsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesButtonsScroll}
          >
            {[
              "Book now",
              "Gallery",
              "Emergency slot",
              "Services",
              "Message",
              "Reviews",
              "About",
            ].map((title, index) => (
              <TouchableOpacity key={index} style={styles.serviceButton}>
                <Text style={styles.serviceButtonText}>{title}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.serviceButton, { backgroundColor: Colors.RED }]}
              onPress={handleSignOut}
            >
              <Text style={styles.serviceButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.imagesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imagesContainer}
          >
            {providerData.gallery && providerData.gallery.length > 0 ? (
              providerData.gallery.map((imageUri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.galleryImage}
                  />
                </View>
              ))
            ) : (
              <>
                <View style={styles.imageContainer}>
                  <TouchableOpacity
                    style={styles.plusContainer}
                    onPress={handleAddImage}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <ActivityIndicator size="large" color={Colors.PRIMARY} />
                    ) : (
                      <>
                        <Text style={styles.plusText}>+</Text>
                        <Text style={styles.addImageText}>Add Images</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
                {Array.from({ length: 5 }).map((_, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <View style={styles.emptyPlaceholder}></View>
                  </View>
                ))}
              </>
            )}
          </ScrollView>
        </View>
        {/* Services Section */}
        <View style={styles.servicesStackedSection}>
          <Text style={styles.sectionTitle}>Services</Text>
          {providerData.services && providerData.services.length > 0 ? (
            providerData.services.map((service, index) => (
              <TouchableOpacity
                key={index}
                style={styles.serviceCard}
                onPress={() => {
                  // Navigate to edit screen or show modal here
                  console.log("Tapped service:", service.name);
                }}
              >
                <View style={styles.serviceCardHeader}>
                  {service.image && (
                    <Image
                      source={{ uri: service.image }}
                      style={styles.serviceCardImage}
                    />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.serviceCardTitle}>{service.name}</Text>
                    <Text style={styles.serviceCardCategory}>
                      {service.category}
                    </Text>
                  </View>
                </View>
                <Text style={styles.serviceCardDescription}>
                  {service.description}
                </Text>
                <View style={styles.serviceCardMeta}>
                  <Text style={styles.serviceMetaText}>${service.price}</Text>
                  <Text style={styles.serviceMetaText}>
                    Deposit: ${service.deposit}
                  </Text>
                  <Text style={styles.serviceMetaText}>
                    {service.duration} mins
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noServicesText}>
              You haven’t added any services yet.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.PINK },
  container: { padding: 20 },
  headerContainer: {
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: Colors.PRIMARY,
    paddingBottom: 15,
  },
  profileImageWrapper: {
    position: "relative",
    width: 120,
    height: 120,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: Colors.PRIMARY,
  },
  addIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  addIconText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  infoContainer: { marginTop: 10, alignItems: "center" },
  name: { fontSize: 32, fontWeight: "bold", color: Colors.PRIMARY },
  reliability: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  service: { fontSize: 16, color: Colors.PRIMARY, marginTop: 5 },
  servicesSection: { paddingVertical: 15 },
  serviceItem: {
    marginBottom: 15,
    backgroundColor: Colors.WHITE,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  serviceName: { fontSize: 16, fontWeight: "bold" },
  serviceDescription: { fontSize: 14, color: Colors.GRAY },
  serviceDetails: { fontSize: 14, color: Colors.GRAY },
  servicesButtonsContainer: { marginBottom: 15 },
  servicesButtonsScroll: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  serviceButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  imagesSection: { marginBottom: 20 },
  imagesContainer: { flexDirection: "row" },
  imageContainer: { marginRight: 15, alignItems: "center" },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    resizeMode: "cover",
    borderWidth: 3,
    borderColor: Colors.PRIMARY,
  },
  plusContainer: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: Colors.LIGHT_GRAY,
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: {
    fontSize: 40,
    color: Colors.PRIMARY,
    fontWeight: "bold",
  },
  addImageText: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontWeight: "bold",
    marginTop: 5,
  },
  emptyPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: Colors.PRIMARY,
    borderWidth: 2,
    borderColor: Colors.GRAY,
    opacity: 0.2,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
  servicesStackedSection: {
    marginTop: 30,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginBottom: 15,
  },

  serviceCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  serviceCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  serviceCardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },

  serviceCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.PRIMARY,
  },

  serviceCardCategory: {
    fontSize: 14,
    color: Colors.GRAY,
    marginTop: 3,
  },

  serviceCardDescription: {
    fontSize: 14,
    color: Colors.DARK_GRAY,
    marginBottom: 10,
  },

  serviceCardMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  serviceMetaText: {
    fontSize: 13,
    color: Colors.GRAY,
  },

  noServicesText: {
    fontSize: 14,
    color: Colors.GRAY,
    fontStyle: "italic",
  },
});
