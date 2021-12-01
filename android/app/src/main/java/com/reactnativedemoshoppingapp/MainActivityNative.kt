package com.reactnativedemoshoppingapp

import android.R.attr
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import android.app.KeyguardManager
import android.content.Context
import android.R.attr.description
import android.widget.Button
import com.reactnativedemoshoppingapp.R


class MainActivityNative : AppCompatActivity() {

    private lateinit var payButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
//        payButton = this.findViewById(R.id.buttonPayout)
//
//        payButton.setOnClickListener() {
//
//        }
    }

}