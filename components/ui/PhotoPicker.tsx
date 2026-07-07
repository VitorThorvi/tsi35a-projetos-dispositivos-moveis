import { Button } from "@rneui/themed";
import { randomUUID } from "expo-crypto";
import { Directory, File, Paths } from "expo-file-system";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../../constants/theme";

export type PhotoPickerProps = {
  photos: string[];
  onChange: (photos: string[]) => void;
  disabled?: boolean;
};

const PHOTOS_DIRNAME = "listing-photos";

type PhotoThumbnailProps = {
  uri: string;
  disabled: boolean;
  onRemove: (uri: string) => void;
};

function PhotoThumbnail({ uri, disabled, onRemove }: PhotoThumbnailProps) {
  return (
    <View style={styles.thumbWrapper}>
      <Image source={{ uri }} style={styles.thumb} contentFit="cover" />
      {!disabled && (
        <Pressable
          accessibilityLabel="Remover foto"
          onPress={() => onRemove(uri)}
          hitSlop={8}
          style={styles.removeButton}
        >
          <Text style={styles.removeIcon}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

function EmptyPhotos() {
  return <Text style={styles.emptyHint}>Nenhuma foto adicionada.</Text>;
}

export function PhotoPicker({
  photos,
  onChange,
  disabled = false,
}: PhotoPickerProps) {
  const handleRemove = useCallback(
    (uri: string) => {
      onChange(photos.filter((photo) => photo !== uri));
    },
    [photos, onChange],
  );

  async function handleAdd() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 1,
      });
      if (result.canceled) {
        return;
      }

      const directory = new Directory(Paths.document, PHOTOS_DIRNAME);
      if (!directory.exists) {
        directory.create({ intermediates: true });
      }

      const copied = result.assets.map((asset) => {
        const source = new File(asset.uri);
        const extension = source.extension || ".jpg";
        const destination = new File(directory, `${randomUUID()}${extension}`);
        source.copy(destination);
        return destination.uri;
      });

      onChange([...photos, ...copied]);
    } catch {
      Alert.alert("Erro", "Não foi possível adicionar a foto.");
    }
  }

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <PhotoThumbnail uri={item} disabled={disabled} onRemove={handleRemove} />
    ),
    [disabled, handleRemove],
  );

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={photos}
        keyExtractor={(uri) => uri}
        renderItem={renderItem}
        ListEmptyComponent={EmptyPhotos}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
      <Button
        title="Adicionar foto"
        type="outline"
        onPress={handleAdd}
        disabled={disabled}
        containerStyle={styles.addButton}
      />
    </View>
  );
}

const THUMB_SIZE = 88;

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  list: {
    gap: 12,
    alignItems: "center",
  },
  thumbWrapper: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  removeIcon: {
    color: colors.background,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 16,
  },
  emptyHint: {
    color: colors.textSecondary,
    fontSize: 14,
    paddingVertical: 12,
  },
  addButton: {
    alignSelf: "flex-start",
  },
});
