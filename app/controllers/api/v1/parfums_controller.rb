module Api
  module V1
    class ParfumsController < ApplicationController
      def index
        parfums = Parfum.includes(:brand).all
        render json: parfums.as_json(include: { brand: { only: [ :id, :name ] } })
      end

      def show
        parfum = Parfum.includes(:brand).find_by(id: params[:id])
        if parfum
          render json: parfum.as_json(include: { brand: { only: [ :id, :name ] } })
        else
          render json: { error: "Parfum not found" }, status: :not_found
        end
      end
    end
  end
end
