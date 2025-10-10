from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras import layers,models

NUM_CLASSES = 38
IMG_SIZE = (160,160)

def get_model(weights_path=None):
  base_model = EfficientNetB0(
    include_top=False,
    weights='imagenet',
    input_shape = IMG_SIZE + (3,)
  )

  base_model.trainable =True
  for layer in base_model.layers[:-20]:
    layer.trainable = False


  model = models.Sequential([
  base_model,
  layers.GlobalAveragePooling2D(),
  layers.Dropout(0.3),
  layers.Dense(NUM_CLASSES,activation='softmax')
  ])

  if weights_path:
    model.load_weights(weights_path,by_name=True)
    print(f"Loaded weights from {weights_path}")

  return model
  