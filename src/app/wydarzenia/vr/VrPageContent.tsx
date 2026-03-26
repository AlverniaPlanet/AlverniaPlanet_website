"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NextImage from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/app/i18n-provider";
import Card from "@/app/components/Card";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { getLocalizedPath, type Locale } from "@/lib/localizedRoutes";
import {
  DOME_VR_SCENES_BY_KEY,
  VR_DOME_ORDER,
  VR_DOME_TITLES,
  VR_UI,
  type DomeVrScene,
  type VrDomeKey,
} from "./vrData";

const DEFAULT_YAW_DEGREES = 180;
const DEFAULT_PITCH_DEGREES = 0;
const DEFAULT_FOV_DEGREES = 72;
const MIN_FOV_DEGREES = 42;
const MAX_FOV_DEGREES = 92;
const MAX_PITCH_DEGREES = 80;
const DRAG_YAW_DEGREES = 220;
const DRAG_PITCH_DEGREES = 140;

const VERTEX_SHADER_SOURCE = `
attribute vec2 aPosition;
varying vec2 vUv;

void main() {
  vUv = (aPosition + 1.0) * 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float uYaw;
uniform float uPitch;
uniform float uFov;
uniform float uTextureVScale;
uniform float uTextureVOffset;

const float PI = 3.1415926535897932384626433832795;

mat3 rotateX(float angle) {
  float s = sin(angle);
  float c = cos(angle);

  return mat3(
    1.0, 0.0, 0.0,
    0.0, c, -s,
    0.0, s, c
  );
}

mat3 rotateY(float angle) {
  float s = sin(angle);
  float c = cos(angle);

  return mat3(
    c, 0.0, s,
    0.0, 1.0, 0.0,
    -s, 0.0, c
  );
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float halfFov = radians(uFov) * 0.5;
  float tanHalfFov = tan(halfFov);
  vec2 clip = vUv * 2.0 - 1.0;

  vec3 direction = normalize(vec3(
    clip.x * aspect * tanHalfFov,
    clip.y * tanHalfFov,
    -1.0
  ));

  direction = rotateY(radians(uYaw)) * rotateX(radians(uPitch)) * direction;

  float longitude = atan(direction.x, -direction.z);
  float latitude = asin(clamp(direction.y, -1.0, 1.0));

  float u = longitude / (2.0 * PI) + 0.5;
  float v = 0.5 - latitude / PI;
  vec2 sampleUv = vec2(fract(u), clamp(v * uTextureVScale + uTextureVOffset, 0.0, 1.0));

  gl_FragColor = texture2D(uTexture, sampleUv);
}
`;

type VrUiCopy = (typeof VR_UI)[Locale];

type CameraState = {
  yaw: number;
  pitch: number;
  fov: number;
};

type PanoramaRenderer = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  positionBuffer: WebGLBuffer;
  positionLocation: number;
  texture: WebGLTexture;
  textureCrop: {
    vScale: number;
    vOffset: number;
  };
  uniforms: {
    resolution: WebGLUniformLocation;
    texture: WebGLUniformLocation;
    yaw: WebGLUniformLocation;
    pitch: WebGLUniformLocation;
    fov: WebGLUniformLocation;
    textureVScale: WebGLUniformLocation;
    textureVOffset: WebGLUniformLocation;
  };
};

type PanoramaViewerProps = {
  scene: DomeVrScene;
  sceneIndex: number;
  sceneCount: number;
  spaceTitle: string;
  ui: VrUiCopy;
  canChangeScene: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

type VrMapHotspot = {
  id: string;
  vrKey: VrDomeKey;
  label: string;
  x: number;
  y: number;
};

const VR_MAP_HOTSPOTS: VrMapHotspot[] = [
  { id: "k3", vrKey: "k3", label: "K3", x: 59.5, y: 19.8 },
  { id: "k4", vrKey: "k4", label: "K4", x: 78.2, y: 28.6 },
  { id: "k1", vrKey: "k1", label: "K1", x: 56.9, y: 41.0 },
  { id: "k11", vrKey: "k11", label: "K11", x: 66.6, y: 42.6 },
  { id: "k8", vrKey: "k8", label: "K8", x: 43.8, y: 46.7 },
  { id: "k13", vrKey: "k13", label: "K13", x: 38.2, y: 35.8 },
  { id: "k14", vrKey: "laboratorium", label: "K14", x: 37.0, y: 42.3 },
  { id: "k7", vrKey: "k7", label: "K7", x: 52.2, y: 52.0 },
  { id: "k10", vrKey: "k10", label: "K10", x: 73.5, y: 49.0 },
  { id: "k2", vrKey: "k2-recepcja", label: "K2", x: 62.4, y: 56.6 },
  { id: "k12", vrKey: "k12", label: "K12", x: 70.0, y: 61.9 },
  { id: "k9", vrKey: "k9", label: "K9", x: 47.0, y: 66.8 },
  { id: "k5", vrKey: "k5", label: "K5", x: 40.4, y: 65.0 },
  { id: "k6", vrKey: "k6", label: "K6", x: 42.8, y: 71.1 },
  { id: "k15", vrKey: "silos", label: "K15", x: 15.6, y: 56.4 },
];

const VR_SELECTION_UI: Record<
  Locale,
  {
    selectionLabel: string;
    selectionTitle: string;
    selectionIntro: string;
    mapLabel: string;
    mapTitle: string;
    mapAlt: string;
    mapSelectLabel: string;
    scenePickerLabel: string;
    mapNoteLaboratory: string;
    mapNoteSilos: string;
    notOnMapLabel: string;
  }
> = {
  pl: {
    selectionLabel: "Przestrzenie VR",
    selectionTitle: "Wybierz przestrzeń",
    selectionIntro: "Możesz przełączyć panoramę z listy albo kliknąć oznaczenie na mapie technicznej.",
    mapLabel: "Mapa techniczna kopuł",
    mapTitle: "Kliknij zaznaczoną przestrzeń na planie, aby od razu otworzyć jej panoramę.",
    mapAlt: "Mapa techniczna Alvernia Planet z zaznaczonymi przestrzeniami VR",
    mapSelectLabel: "Wybierz przestrzeń z mapy",
    scenePickerLabel: "Panoramy w tej przestrzeni",
    mapNoteLaboratory: "K14 = Laboratorium",
    mapNoteSilos: "K15 = Silosy",
    notOnMapLabel: "Poza mapą: Taras, Warsztaty, Łącznik",
  },
  en: {
    selectionLabel: "VR spaces",
    selectionTitle: "Choose a space",
    selectionIntro: "Switch panoramas from the list or click the marked area on the technical map.",
    mapLabel: "Technical dome map",
    mapTitle: "Click a highlighted area on the plan to open its panorama immediately.",
    mapAlt: "Technical map of Alvernia Planet with marked VR spaces",
    mapSelectLabel: "Choose a space from the map",
    scenePickerLabel: "Panoramas in this space",
    mapNoteLaboratory: "K14 = Laboratory",
    mapNoteSilos: "K15 = Silos",
    notOnMapLabel: "Outside the map: Terrace, Workshops, Connector",
  },
  pt: {
    selectionLabel: "Espaços VR",
    selectionTitle: "Escolher espaço",
    selectionIntro: "Pode mudar a panorâmica pela lista ou clicar na área marcada no mapa técnico.",
    mapLabel: "Mapa técnico das cúpulas",
    mapTitle: "Clique numa área marcada no plano para abrir imediatamente a sua panorâmica.",
    mapAlt: "Mapa técnico da Alvernia Planet com espaços VR assinalados",
    mapSelectLabel: "Escolher espaço no mapa",
    scenePickerLabel: "Panorâmicas neste espaço",
    mapNoteLaboratory: "K14 = Laboratório",
    mapNoteSilos: "K15 = Silos",
    notOnMapLabel: "Fora do mapa: Terraço, Oficinas, Ligação",
  },
};

function isVrDomeKey(value: string | null): value is VrDomeKey {
  return Boolean(value && VR_DOME_ORDER.includes(value as VrDomeKey));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function wrapDegrees(value: number) {
  const wrapped = value % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
}

function getDefaultCamera(scene: DomeVrScene): CameraState {
  const initialYaw =
    typeof scene.initialYaw === "number"
      ? wrapDegrees((scene.initialYaw / 100) * 360)
      : DEFAULT_YAW_DEGREES;

  return {
    yaw: initialYaw,
    pitch: DEFAULT_PITCH_DEGREES,
    fov: DEFAULT_FOV_DEGREES,
  };
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  if (!shader) {
    throw new Error("Shader creation failed.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader) ?? "Unknown shader error.";
    gl.deleteShader(shader);
    throw new Error(error);
  }

  return shader;
}

function getUniformLocation(gl: WebGLRenderingContext, program: WebGLProgram, name: string) {
  const location = gl.getUniformLocation(program, name);

  if (location === null) {
    throw new Error(`Missing uniform: ${name}`);
  }

  return location;
}

function getTextureCrop(image: HTMLImageElement) {
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;

  if (width <= 0 || height <= 0) {
    return { vScale: 1, vOffset: 0 };
  }

  const ratio = width / height;

  if (ratio >= 1.9) {
    return { vScale: 1, vOffset: 0 };
  }

  if (ratio >= 0.95 && ratio <= 1.05) {
    return { vScale: 0.5, vOffset: 0 };
  }

  return { vScale: 1, vOffset: 0 };
}

function createPanoramaRenderer(gl: WebGLRenderingContext): PanoramaRenderer {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
  const program = gl.createProgram();

  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    throw new Error("Program creation failed.");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program) ?? "Unknown program error.";
    gl.deleteProgram(program);
    throw new Error(error);
  }

  const positionBuffer = gl.createBuffer();
  const texture = gl.createTexture();

  if (!positionBuffer || !texture) {
    if (positionBuffer) {
      gl.deleteBuffer(positionBuffer);
    }
    if (texture) {
      gl.deleteTexture(texture);
    }
    gl.deleteProgram(program);
    throw new Error("Renderer resources could not be created.");
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ]),
    gl.STATIC_DRAW,
  );

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([2, 4, 12, 255]),
  );

  gl.clearColor(0.01, 0.02, 0.05, 1);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);

  return {
    gl,
    program,
    positionBuffer,
    positionLocation: gl.getAttribLocation(program, "aPosition"),
    texture,
    textureCrop: {
      vScale: 1,
      vOffset: 0,
    },
    uniforms: {
      resolution: getUniformLocation(gl, program, "uResolution"),
      texture: getUniformLocation(gl, program, "uTexture"),
      yaw: getUniformLocation(gl, program, "uYaw"),
      pitch: getUniformLocation(gl, program, "uPitch"),
      fov: getUniformLocation(gl, program, "uFov"),
      textureVScale: getUniformLocation(gl, program, "uTextureVScale"),
      textureVOffset: getUniformLocation(gl, program, "uTextureVOffset"),
    },
  };
}

function PanoramaViewer({
  scene,
  sceneIndex,
  sceneCount,
  spaceTitle,
  ui,
  canChangeScene,
  onPrevious,
  onNext,
}: PanoramaViewerProps) {
  const [camera, setCamera] = useState<CameraState>(() => getDefaultCamera(scene));
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<PanoramaRenderer | null>(null);
  const frameRef = useRef<number | null>(null);
  const dragRef = useRef({
    pointerId: null as number | null,
    startX: 0,
    startY: 0,
    startYaw: DEFAULT_YAW_DEGREES,
    startPitch: DEFAULT_PITCH_DEGREES,
  });

  const resetView = () => setCamera(getDefaultCamera(scene));

  useEffect(() => {
    const element = viewportRef.current;
    if (!element || typeof ResizeObserver === "undefined") {
      return;
    }

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setViewportSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();

    const observer = new ResizeObserver(() => updateSize());
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: true,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      setViewerError(ui.viewerUnavailableLabel);
      setIsLoading(false);
      return;
    }

    try {
      rendererRef.current = createPanoramaRenderer(gl);
    } catch {
      setViewerError(ui.viewerUnavailableLabel);
      setIsLoading(false);
      return;
    }

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      const renderer = rendererRef.current;
      if (!renderer) {
        return;
      }

      renderer.gl.deleteTexture(renderer.texture);
      renderer.gl.deleteBuffer(renderer.positionBuffer);
      renderer.gl.deleteProgram(renderer.program);
      rendererRef.current = null;
    };
  }, [ui.viewerUnavailableLabel]);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) {
      return;
    }

    let isCancelled = false;
    const image = new Image();
    image.decoding = "async";

    setCamera(getDefaultCamera(scene));
    setIsLoading(true);
    setViewerError(null);

    renderer.textureCrop = {
      vScale: 1,
      vOffset: 0,
    };
    renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, renderer.texture);
    renderer.gl.texImage2D(
      renderer.gl.TEXTURE_2D,
      0,
      renderer.gl.RGBA,
      1,
      1,
      0,
      renderer.gl.RGBA,
      renderer.gl.UNSIGNED_BYTE,
      new Uint8Array([2, 4, 12, 255]),
    );

    image.onload = () => {
      if (isCancelled || !rendererRef.current) {
        return;
      }

      const nextRenderer = rendererRef.current;
      nextRenderer.textureCrop = getTextureCrop(image);
      nextRenderer.gl.bindTexture(nextRenderer.gl.TEXTURE_2D, nextRenderer.texture);
      nextRenderer.gl.pixelStorei(nextRenderer.gl.UNPACK_FLIP_Y_WEBGL, 0);
      nextRenderer.gl.texImage2D(
        nextRenderer.gl.TEXTURE_2D,
        0,
        nextRenderer.gl.RGBA,
        nextRenderer.gl.RGBA,
        nextRenderer.gl.UNSIGNED_BYTE,
        image,
      );
      setIsLoading(false);
    };

    image.onerror = () => {
      if (isCancelled) {
        return;
      }

      setViewerError(ui.viewerUnavailableLabel);
      setIsLoading(false);
    };

    image.src = encodeURI(scene.src);

    return () => {
      isCancelled = true;
    };
  }, [scene, ui.viewerUnavailableLabel]);

  useEffect(() => {
    const renderer = rendererRef.current;
    const canvas = canvasRef.current;

    if (!renderer || !canvas || viewportSize.width <= 0 || viewportSize.height <= 0) {
      return;
    }

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = window.requestAnimationFrame(() => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, isDragging ? 1.05 : 1.5);
      const width = Math.max(480, Math.round(viewportSize.width * pixelRatio));
      const height = Math.max(320, Math.round(viewportSize.height * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const { gl } = renderer;
      gl.viewport(0, 0, width, height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(renderer.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, renderer.positionBuffer);
      gl.enableVertexAttribArray(renderer.positionLocation);
      gl.vertexAttribPointer(renderer.positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, renderer.texture);
      gl.uniform1i(renderer.uniforms.texture, 0);
      gl.uniform2f(renderer.uniforms.resolution, width, height);
      gl.uniform1f(renderer.uniforms.yaw, camera.yaw);
      gl.uniform1f(renderer.uniforms.pitch, camera.pitch);
      gl.uniform1f(renderer.uniforms.fov, camera.fov);
      gl.uniform1f(renderer.uniforms.textureVScale, renderer.textureCrop.vScale);
      gl.uniform1f(renderer.uniforms.textureVOffset, renderer.textureCrop.vOffset);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    });

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [camera, isDragging, viewportSize, viewerError, isLoading]);

  const adjustZoom = (delta: number) =>
    setCamera((current) => ({
      ...current,
      fov: clamp(current.fov + delta, MIN_FOV_DEGREES, MAX_FOV_DEGREES),
    }));

  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-white/12 bg-[#040611] shadow-[0_32px_90px_rgba(0,0,0,0.45)]">
      <div
        ref={viewportRef}
        className={`relative aspect-[16/10] overflow-hidden sm:aspect-[16/9] ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        tabIndex={0}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) {
            return;
          }

          dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            startYaw: camera.yaw,
            startPitch: camera.pitch,
          };
          setIsDragging(true);
          event.currentTarget.setPointerCapture(event.pointerId);
          event.preventDefault();
        }}
        onPointerMove={(event) => {
          const rect = viewportRef.current?.getBoundingClientRect();
          if (!rect || rect.width <= 0 || rect.height <= 0) {
            return;
          }

          if (!isDragging || dragRef.current.pointerId !== event.pointerId) {
            return;
          }

          const deltaX = event.clientX - dragRef.current.startX;
          const deltaY = event.clientY - dragRef.current.startY;
          setCamera((current) => ({
            ...current,
            yaw: wrapDegrees(dragRef.current.startYaw - (deltaX / rect.width) * DRAG_YAW_DEGREES),
            pitch: clamp(
              dragRef.current.startPitch + (deltaY / rect.height) * DRAG_PITCH_DEGREES,
              -MAX_PITCH_DEGREES,
              MAX_PITCH_DEGREES,
            ),
          }));
        }}
        onPointerUp={(event) => {
          if (dragRef.current.pointerId === event.pointerId) {
            event.currentTarget.releasePointerCapture(event.pointerId);
            dragRef.current.pointerId = null;
            setIsDragging(false);
          }
        }}
        onPointerCancel={() => {
          dragRef.current.pointerId = null;
          setIsDragging(false);
        }}
        onWheel={(event) => {
          event.preventDefault();
          adjustZoom(event.deltaY * 0.03);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            setCamera((current) => ({ ...current, yaw: wrapDegrees(current.yaw - 8) }));
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            setCamera((current) => ({ ...current, yaw: wrapDegrees(current.yaw + 8) }));
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            setCamera((current) => ({
              ...current,
              pitch: clamp(current.pitch - 6, -MAX_PITCH_DEGREES, MAX_PITCH_DEGREES),
            }));
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setCamera((current) => ({
              ...current,
              pitch: clamp(current.pitch + 6, -MAX_PITCH_DEGREES, MAX_PITCH_DEGREES),
            }));
          }
          if (event.key === "+" || event.key === "=") {
            event.preventDefault();
            adjustZoom(-6);
          }
          if (event.key === "-" || event.key === "_") {
            event.preventDefault();
            adjustZoom(6);
          }
          if (event.key === "0") {
            event.preventDefault();
            resetView();
          }
        }}
        style={{ touchAction: "none" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full bg-[#02040c]"
          role="img"
          aria-label={scene.title}
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_58%,rgba(2,6,18,0.18)_74%,rgba(2,6,18,0.6)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 via-black/22 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/68 via-black/18 to-transparent" />

        <div className="absolute inset-x-4 top-4 flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-[min(100%,23rem)] rounded-2xl bg-black/38 px-4 py-3 ring-1 ring-white/10 backdrop-blur-md">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-[#7ef6ff]/78">
              360°
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white sm:text-xl">{spaceTitle}</h3>
            <p className="mt-1 text-sm text-white/66">
              {scene.title} · {sceneIndex + 1}/{sceneCount}
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <span className="rounded-full bg-black/36 px-3 py-2 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-white/72 ring-1 ring-white/10 backdrop-blur-md">
              {ui.dragLabel}
            </span>
            <span className="rounded-full bg-black/36 px-3 py-2 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-white/72 ring-1 ring-white/10 backdrop-blur-md">
              {ui.zoomLabel}
            </span>
          </div>
        </div>

        <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[min(100%,30rem)] rounded-2xl bg-black/38 px-4 py-3 ring-1 ring-white/10 backdrop-blur-md">
            <p className="text-sm leading-relaxed text-white/72">{ui.hint}</p>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              aria-label={ui.zoomOutLabel}
              onClick={() => adjustZoom(8)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-black/42 text-xl font-semibold text-white/86 transition duration-300 hover:border-[#7ef6ff]/52 hover:text-white"
            >
              -
            </button>
            <button
              type="button"
              aria-label={ui.zoomInLabel}
              onClick={() => adjustZoom(-8)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-black/42 text-xl font-semibold text-white/86 transition duration-300 hover:border-[#7ef6ff]/52 hover:text-white"
            >
              +
            </button>
            <button
              type="button"
              onClick={resetView}
              className="rounded-full border border-white/12 bg-black/42 px-4 py-2 text-sm font-medium text-white/82 transition duration-300 hover:border-[#7ef6ff]/52 hover:text-white"
            >
              {ui.resetView}
            </button>
          </div>
        </div>

        {canChangeScene ? (
          <>
            <button
              type="button"
              aria-label={ui.previousLabel}
              onClick={onPrevious}
              className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/42 text-2xl text-white/88 transition duration-300 hover:border-[#7ef6ff]/52 hover:text-white"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label={ui.nextLabel}
              onClick={onNext}
              className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/42 text-2xl text-white/88 transition duration-300 hover:border-[#7ef6ff]/52 hover:text-white"
            >
              ›
            </button>
          </>
        ) : null}

        {isLoading ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/28 backdrop-blur-[2px]">
            <div className="rounded-full border border-white/10 bg-black/46 px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.26em] text-white/64">
              360°
            </div>
          </div>
        ) : null}

        {viewerError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#040611]/82 p-6 text-center">
            <p className="max-w-sm text-sm leading-relaxed text-white/70">{viewerError}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function VrPageContent() {
  const { locale } = useI18n();
  const loc = ((locale as Locale) ?? "pl") as Locale;
  const ui = VR_UI[loc];
  const selectionUi = VR_SELECTION_UI[loc];
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedDome = searchParams.get("dome");
  const initialDome: VrDomeKey = isVrDomeKey(requestedDome) ? requestedDome : "k1";
  const [activeDome, setActiveDome] = useState<VrDomeKey>(initialDome);
  const [sceneIndex, setSceneIndex] = useState(0);
  const scenes = useMemo(() => DOME_VR_SCENES_BY_KEY[activeDome] ?? [], [activeDome]);
  const activeScene = scenes[sceneIndex] ?? scenes[0];
  const eventsHref = getLocalizedPath("/wydarzenia", loc);
  const pageBaseHref = getLocalizedPath("/wydarzenia/vr", loc);
  const totalSceneCount = useMemo(
    () =>
      Object.values(DOME_VR_SCENES_BY_KEY).reduce((count, domeScenes) => count + domeScenes.length, 0),
    [],
  );
  const mappedVrKeys = useMemo(() => new Set(VR_MAP_HOTSPOTS.map((spot) => spot.vrKey)), []);

  useEffect(() => {
    if (!isVrDomeKey(requestedDome)) {
      return;
    }

    setActiveDome((current) => (current === requestedDome ? current : requestedDome));
    setSceneIndex(0);
  }, [requestedDome]);

  useEffect(() => {
    setSceneIndex(0);
  }, [activeDome]);

  useEffect(() => {
    const currentDome = searchParams.get("dome");

    if (currentDome === activeDome) {
      return;
    }

    router.replace(`${pageBaseHref}?dome=${activeDome}`, { scroll: false });
  }, [activeDome, pageBaseHref, router, searchParams]);

  const previousScene = () => setSceneIndex((current) => (current - 1 + scenes.length) % scenes.length);
  const nextScene = () => setSceneIndex((current) => (current + 1) % scenes.length);
  const activateDome = (domeKey: VrDomeKey) => {
    setActiveDome(domeKey);
    setSceneIndex(0);
  };

  return (
    <main className="relative min-h-screen px-4 py-16 text-white sm:py-20">
      <div className="ap-shell space-y-8">
        <ScrollMotionItem strength="soft" delay={40} className="ap-deferred-section">
          <header className="space-y-5 text-center">
            <p className="ap-type-kicker">{ui.pageKicker}</p>
            <h1 className="ap-type-hero-title">{ui.pageTitle}</h1>
            <p className="ap-type-hero-subtitle mx-auto max-w-4xl">{ui.pageIntro}</p>
            <div className="flex justify-center">
              <PrimaryButton href={eventsHref}>{ui.backToEvents}</PrimaryButton>
            </div>
          </header>
        </ScrollMotionItem>

        <ScrollMotionItem strength="strong" delay={80} className="ap-deferred-section">
          <Card
            variant="solid"
            motion="off"
            className="overflow-hidden bg-[linear-gradient(180deg,rgba(8,14,30,0.94)_0%,rgba(10,14,30,0.98)_100%)]"
          >
            <div className="space-y-7">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <p className="text-[0.72rem] font-medium uppercase tracking-[0.28em] text-[#7ef6ff]/74">
                    {ui.catalogLabel}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                      {VR_DOME_TITLES[loc][activeDome]}
                    </h2>
                    <span className="rounded-full border border-[#7ef6ff]/28 bg-[#09192f] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#9fefff]">
                      {sceneIndex + 1}/{scenes.length}
                    </span>
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/66 sm:text-base">
                    {ui.hint}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[24rem]">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
                    <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-white/44">
                      {ui.spacesLabel}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">{VR_DOME_ORDER.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
                    <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-white/44">
                      {ui.scenesLabel}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">{totalSceneCount}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
                    <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-white/44">
                      360°
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">{ui.sceneCount(scenes.length)}</p>
                  </div>
                </div>
              </div>

              {activeScene ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <PanoramaViewer
                      key={activeScene.id}
                      scene={activeScene}
                      sceneIndex={sceneIndex}
                      sceneCount={scenes.length}
                      spaceTitle={VR_DOME_TITLES[loc][activeDome]}
                      ui={ui}
                      canChangeScene={scenes.length > 1}
                      onPrevious={previousScene}
                      onNext={nextScene}
                    />
                  </div>

                  <section className="rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5 md:p-6">
                    <div className="grid gap-6 xl:grid-cols-[minmax(19rem,22rem)_minmax(0,1fr)] xl:items-start">
                      <div className="space-y-5">
                        <div className="space-y-3">
                          <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-white/44">
                            {selectionUi.selectionLabel}
                          </p>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-semibold text-white sm:text-xl">
                              {selectionUi.selectionTitle}
                            </h3>
                            <span className="rounded-full border border-[#7ef6ff]/24 bg-[#08182e] px-3 py-1 text-xs font-medium text-[#9fefff]">
                              {VR_DOME_TITLES[loc][activeDome]}
                            </span>
                          </div>
                          <p className="max-w-xl text-sm leading-relaxed text-white/66">
                            {selectionUi.selectionIntro}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {VR_DOME_ORDER.map((domeKey) => {
                            const isActive = domeKey === activeDome;

                            return (
                              <button
                                key={domeKey}
                                type="button"
                                onClick={() => activateDome(domeKey)}
                                className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 ${
                                  isActive
                                    ? "border-[#7ef6ff]/66 bg-[#09192f] text-white shadow-[0_0_0_1px_rgba(126,246,255,0.12)]"
                                    : "border-white/12 bg-white/[0.03] text-white/72 hover:border-[#7ef6ff]/40 hover:text-white"
                                }`}
                              >
                                {VR_DOME_TITLES[loc][domeKey]}
                              </button>
                            );
                          })}
                        </div>

                        {scenes.length > 1 ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-white/44">
                                {selectionUi.scenePickerLabel}
                              </p>
                              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-white/64">
                                {scenes.length}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {scenes.map((scene, index) => {
                                const isActive = index === sceneIndex;

                                return (
                                  <button
                                    key={scene.id}
                                    type="button"
                                    onClick={() => setSceneIndex(index)}
                                    className={`rounded-full border px-3 py-2 text-sm font-semibold transition duration-300 ${
                                      isActive
                                        ? "border-[#7ef6ff]/58 bg-[#0a1730] text-white"
                                        : "border-white/12 bg-black/[0.18] text-white/70 hover:border-[#7ef6ff]/36 hover:text-white"
                                    }`}
                                  >
                                    {index + 1}/{scenes.length}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}

                        <div className="flex flex-wrap gap-2 text-xs text-white/62">
                          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
                            {selectionUi.mapNoteLaboratory}
                          </span>
                          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
                            {selectionUi.mapNoteSilos}
                          </span>
                          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
                            {selectionUi.notOnMapLabel}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-white/44">
                            {selectionUi.mapLabel}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold text-white">{selectionUi.mapTitle}</h3>
                        </div>

                        <div className="relative aspect-[1676/1276] overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#070b16]/90 shadow-[0_30px_80px_rgba(2,6,18,0.46)]">
                          <NextImage
                            src="/wydarzenia/mapka.webp"
                            alt={selectionUi.mapAlt}
                            fill
                            sizes="(min-width: 1280px) 52vw, (min-width: 768px) 90vw, 96vw"
                            className="object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_42%,transparent_0%,transparent_44%,rgba(6,10,24,0.18)_72%,rgba(6,10,24,0.34)_100%)]" />
                          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#070b16]/34 via-transparent to-transparent" />

                          {VR_MAP_HOTSPOTS.map((spot) => {
                            const isActive = activeDome === spot.vrKey;

                            return (
                              <button
                                key={spot.id}
                                type="button"
                                className={`group absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full transition duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7ef6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b16] ${
                                  isActive ? "z-20 scale-[1.06]" : "z-10"
                                }`}
                                style={{
                                  left: `${spot.x}%`,
                                  top: `${spot.y}%`,
                                }}
                                aria-label={`${selectionUi.mapSelectLabel}: ${spot.label} · ${VR_DOME_TITLES[loc][spot.vrKey]}`}
                                aria-pressed={isActive}
                                onClick={() => activateDome(spot.vrKey)}
                              >
                                <span
                                  className={`absolute inset-0 rounded-full border transition duration-300 ${
                                    isActive
                                      ? "border-[#7ef6ff]/72 bg-[#7ef6ff]/18 shadow-[0_0_0_1px_rgba(8,16,30,0.45),0_0_16px_rgba(126,246,255,0.35)]"
                                      : "border-white/30 bg-black/26 group-hover:border-[#ffe869]/72 group-hover:bg-[#ffe869]/16"
                                  }`}
                                />
                                <span
                                  className={`absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition duration-300 ${
                                    isActive
                                      ? "bg-[#7ef6ff] shadow-[0_0_10px_rgba(126,246,255,0.8)]"
                                      : "bg-[#ffe869] shadow-[0_0_10px_rgba(255,232,105,0.5)]"
                                  }`}
                                />
                                <span
                                  className={`pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 rounded-full border border-white/14 bg-black/54 px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-white/84 backdrop-blur-sm transition duration-200 ${
                                    isActive
                                      ? "translate-y-0 opacity-100"
                                      : "translate-y-[-2px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                                  }`}
                                >
                                  {spot.label}
                                </span>
                              </button>
                            );
                          })}

                          {!mappedVrKeys.has(activeDome) ? (
                            <div className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-white/12 bg-black/38 px-3 py-2 text-xs font-medium text-white/72 backdrop-blur-md">
                              {VR_DOME_TITLES[loc][activeDome]}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center text-white/68">
                  {ui.emptyLabel}
                </div>
              )}
            </div>
          </Card>
        </ScrollMotionItem>
      </div>
    </main>
  );
}
